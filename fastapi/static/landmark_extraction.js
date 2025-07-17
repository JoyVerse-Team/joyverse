// MediaPipe Face Mesh landmark extraction for frontend
// This is a sample implementation showing how to extract landmarks in the browser

class FaceLandmarkExtractor {
    constructor() {
        this.faceMesh = null;
        this.camera = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.canvasCtx = null;
    }

    async initialize() {
        // Import MediaPipe Face Mesh
        const { FaceMesh } = await import('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js');
        
        this.faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
            }
        });

        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.faceMesh.onResults(this.onResults.bind(this));
    }

    async setupCamera() {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });

        this.videoElement.srcObject = stream;
        return new Promise((resolve) => {
            this.videoElement.onloadedmetadata = () => {
                resolve(this.videoElement);
            };
        });
    }

    onResults(results) {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            
            // Convert to the format expected by your model (936 coordinates)
            const coords = [];
            for (const landmark of landmarks) {
                coords.push(landmark.x, landmark.y);
            }
            
            // Send to emotion detection
            this.sendToEmotionDetection(coords);
        }
    }

    async sendToEmotionDetection(landmarks) {
        try {
            const response = await fetch('/detect_emotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    landmarks: landmarks
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Detected emotion:', result);
                // Handle the emotion result here
                this.onEmotionDetected(result);
            } else {
                console.error('Error detecting emotion:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending landmarks:', error);
        }
    }

    onEmotionDetected(result) {
        // Override this method to handle emotion detection results
        console.log(`Emotion: ${result.emotion}, Confidence: ${result.confidence}`);
    }

    async startDetection() {
        await this.initialize();
        await this.setupCamera();
        
        // Start processing frames
        const processFrame = async () => {
            if (this.videoElement.readyState === 4) {
                await this.faceMesh.send({ image: this.videoElement });
            }
            requestAnimationFrame(processFrame);
        };
        
        processFrame();
    }
}

// Example usage:
/*
const detector = new FaceLandmarkExtractor();

// Override the emotion detection handler
detector.onEmotionDetected = (result) => {
    document.getElementById('emotion-result').textContent = 
        `Emotion: ${result.emotion} (${result.confidence})`;
};

// Start detection
detector.startDetection();
*/
