// Landmark-based emotion detection utility for Joyverse
// This replaces image-based emotion detection with landmark-based detection

export interface LandmarkEmotionData {
  emotion: string;
  confidence: number;
}

// Declare MediaPipe types
declare global {
  interface Window {
    FaceMesh: any;
  }
}

export class LandmarkEmotionDetector {
  private faceMesh: any = null;
  private isInitialized = false;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private isProcessing = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load MediaPipe Face Mesh from CDN
      await this.loadMediaPipeScript();
      
      // Initialize FaceMesh
      this.faceMesh = new window.FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
        }
      });

      this.faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize MediaPipe Face Mesh:', error);
      throw new Error('Failed to initialize face detection. Please check your internet connection.');
    }
  }

  private async loadMediaPipeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.FaceMesh) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js';
      script.onload = () => {
        // Wait a bit for the script to fully initialize
        setTimeout(() => {
          if (window.FaceMesh) {
            resolve();
          } else {
            reject(new Error('FaceMesh not available after script load'));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error('Failed to load MediaPipe Face Mesh script'));
      document.head.appendChild(script);
    });
  }

  async startVideoStream(): Promise<HTMLVideoElement> {
    if (this.videoElement) {
      return this.videoElement;
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });

    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = this.stream;
    this.videoElement.autoplay = true;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;

    await new Promise<void>((resolve) => {
      this.videoElement!.onloadedmetadata = () => resolve();
    });

    return this.videoElement;
  }

  async captureAndDetectEmotion(): Promise<LandmarkEmotionData> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isProcessing) {
      throw new Error('Already processing emotion detection');
    }

    this.isProcessing = true;

    try {
      const videoElement = await this.startVideoStream();
      
      // Extract landmarks from current video frame
      const landmarks = await this.extractLandmarks(videoElement);
      
      if (!landmarks) {
        throw new Error('No face detected or could not extract landmarks');
      }

      // Send landmarks to FastAPI backend
      const emotion = await this.detectEmotionFromLandmarks(landmarks);
      
      return emotion;
    } finally {
      this.isProcessing = false;
      this.cleanup();
    }
  }

  private async extractLandmarks(videoElement: HTMLVideoElement): Promise<number[] | null> {
    if (!this.faceMesh) {
      throw new Error('FaceMesh not initialized');
    }

    return new Promise((resolve) => {
      this.faceMesh!.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          const coords: number[] = [];
          
          for (const landmark of landmarks) {
            coords.push(landmark.x, landmark.y);
          }
          
          resolve(coords);
        } else {
          resolve(null);
        }
      });

      this.faceMesh!.send({ image: videoElement });
    });
  }

  private async detectEmotionFromLandmarks(landmarks: number[]): Promise<LandmarkEmotionData> {
    const fastapiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'https://osmium05-landmark-emotion.hf.space';
    
    const response = await fetch(`${fastapiUrl}/detect_emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        landmarks: landmarks
      })
    });

    if (!response.ok) {
      throw new Error(`FastAPI server returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      emotion: result.emotion,
      confidence: result.confidence
    };
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  // For continuous emotion detection (for real-time games)
  async startContinuousDetection(
    onEmotionDetected: (emotion: LandmarkEmotionData) => void,
    intervalMs: number = 1000
  ): Promise<() => void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const videoElement = await this.startVideoStream();
    let isRunning = true;

    const processFrame = async () => {
      if (!isRunning) return;

      try {
        const landmarks = await this.extractLandmarks(videoElement);
        if (landmarks) {
          const emotion = await this.detectEmotionFromLandmarks(landmarks);
          onEmotionDetected(emotion);
        }
      } catch (error) {
        console.error('Error in continuous emotion detection:', error);
      }

      if (isRunning) {
        setTimeout(processFrame, intervalMs);
      }
    };

    processFrame();

    // Return cleanup function
    return () => {
      isRunning = false;
      this.cleanup();
    };
  }
}

// Singleton instance for use across the application
export const landmarkEmotionDetector = new LandmarkEmotionDetector();
