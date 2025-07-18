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
        minDetectionConfidence: 0.3, // low threshold for better detection
        minTrackingConfidence: 0.3   // low threshold for better tracking
      });

      this.isInitialized = true;
      console.log('MediaPipe Face Mesh initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MediaPipe Face Mesh:', error);
      throw new Error('Failed to initialize face detection. Please check your internet connection.');
    }
  }

  private async loadMediaPipeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.FaceMesh) {
        console.log('MediaPipe FaceMesh already loaded');
        resolve();
        return;
      }

      console.log('Loading MediaPipe Face Mesh script...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js';
      script.onload = () => {
        console.log('MediaPipe script loaded, waiting for initialization...');
        // Wait a bit for the script to fully initialize
        setTimeout(() => {
          if (window.FaceMesh) {
            console.log('MediaPipe FaceMesh available');
            resolve();
          } else {
            console.error('FaceMesh not available after script load');
            reject(new Error('FaceMesh not available after script load'));
          }
        }, 200); // Increased wait time
      };
      script.onerror = (error) => {
        console.error('Failed to load MediaPipe script:', error);
        reject(new Error('Failed to load MediaPipe Face Mesh script'));
      };
      document.head.appendChild(script);
    });
  }

  async startVideoStream(): Promise<HTMLVideoElement> {
    if (this.videoElement) {
      return this.videoElement;
    }

    try {
      console.log('Requesting camera access...');
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Use front camera
        }
      });

      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.stream;
      this.videoElement.autoplay = true;
      this.videoElement.muted = true;
      this.videoElement.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        this.videoElement!.onloadedmetadata = () => {
          console.log('Video metadata loaded:', {
            width: this.videoElement!.videoWidth,
            height: this.videoElement!.videoHeight,
            readyState: this.videoElement!.readyState
          });
          resolve();
        };
        
        this.videoElement!.onerror = (error) => {
          console.error('Video error:', error);
          reject(new Error('Failed to load video stream'));
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error('Video stream timeout'));
        }, 10000);
      });

      // Wait for video to actually start playing
      await new Promise<void>((resolve) => {
        if (this.videoElement!.readyState >= 2) {
          resolve();
        } else {
          this.videoElement!.addEventListener('loadeddata', () => resolve(), { once: true });
        }
      });

      console.log('Video stream started successfully');
      return this.videoElement;
    } catch (error) {
      console.error('Failed to start video stream:', error);
      throw new Error('Failed to access camera. Please ensure camera permissions are granted.');
    }
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
      console.log('Starting emotion detection...');
      const videoElement = await this.startVideoStream();
      
      // Try multiple times to extract landmarks
      let landmarks: number[] | null = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (landmarks === null && attempts < maxAttempts) {
        attempts++;
        console.log(`Attempt ${attempts}/${maxAttempts} to detect face...`);
        
        // Wait a bit between attempts
        if (attempts > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        landmarks = await this.extractLandmarks(videoElement);
      }
      
      if (!landmarks) {
        console.error('Face detection failed after all attempts');
        throw new Error('No face detected or could not extract landmarks. Please ensure your face is clearly visible in the camera.');
      }

      console.log('Face landmarks detected, sending to emotion detection...');
      
      // Send landmarks to FastAPI backend
      const emotion = await this.detectEmotionFromLandmarks(landmarks);
      
      console.log('Emotion detection completed:', emotion);
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

    return new Promise((resolve, reject) => {
      let resolved = false;
      
      // Set up timeout to avoid hanging
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn('Face detection timed out');
          resolve(null);
        }
      }, 5000); // 5 second timeout

      this.faceMesh!.onResults((results: any) => {
        if (resolved) return;
        
        clearTimeout(timeout);
        resolved = true;
        
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          const coords: number[] = [];
          
          for (const landmark of landmarks) {
            coords.push(landmark.x, landmark.y, landmark.z || 0); // Include z coordinate
          }
          
          console.log(`Detected ${landmarks.length} face landmarks, total coords: ${coords.length}`);
          resolve(coords);
        } else {
          console.warn('No face landmarks detected in frame');
          resolve(null);
        }
      });

      // Make sure video is ready and playing
      if (videoElement.readyState >= 2) {
        this.faceMesh!.send({ image: videoElement });
      } else {
        videoElement.addEventListener('loadeddata', () => {
          this.faceMesh!.send({ image: videoElement });
        }, { once: true });
      }
    });
  }

  private async detectEmotionFromLandmarks(landmarks: number[]): Promise<LandmarkEmotionData> {
    const fastapiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'https://osmium05-landmark-emotion.hf.space';
    
    console.log(`Sending ${landmarks.length} coordinates to FastAPI at ${fastapiUrl}`);
    
    try {
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
        const errorText = await response.text();
        console.error(`FastAPI error ${response.status}:`, errorText);
        throw new Error(`FastAPI server returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('FastAPI response:', result);
      
      return {
        emotion: result.emotion,
        confidence: result.confidence || 0
      };
    } catch (error) {
      console.error('Error calling FastAPI:', error);
      throw error;
    }
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

  // Debug function to test camera access
  async testCameraAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera access successful');
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera access failed:', error);
      return false;
    }
  }

  // Debug function to test face detection
  async testFaceDetection(): Promise<{ success: boolean, landmarks?: number[], error?: string }> {
    try {
      await this.initialize();
      const videoElement = await this.startVideoStream();
      
      // Add video to DOM temporarily for debugging
      videoElement.style.position = 'fixed';
      videoElement.style.top = '10px';
      videoElement.style.right = '10px';
      videoElement.style.width = '200px';
      videoElement.style.height = '150px';
      videoElement.style.zIndex = '9999';
      videoElement.style.border = '2px solid red';
      document.body.appendChild(videoElement);
      
      console.log('Testing face detection with video element ready');
      
      const landmarks = await this.extractLandmarks(videoElement);
      
      // Remove video from DOM
      document.body.removeChild(videoElement);
      
      if (landmarks) {
        console.log(`Test successful: ${landmarks.length} coordinates extracted`);
        return { success: true, landmarks };
      } else {
        console.log('Test failed: No face detected');
        return { success: false, error: 'No face detected' };
      }
    } catch (error) {
      console.error('Test error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      this.cleanup();
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
