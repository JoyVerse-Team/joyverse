"""
FastAPI Emotion Detection Service

This service provides emotion detection capabilities for the Joyverse application.
It uses a pre-trained FER Transformer model to analyze facial landmarks
and classify them into 7 basic emotions: happy, sad, angry, fear, surprise, disgust, neutral.

Features:
- Real-time emotion detection from facial landmarks
- RESTful API endpoints for emotion classification
- CORS support for cross-origin requests
- Static file serving for web interface
- Lightweight landmark-based processing

The service runs on port 7860 and integrates with:
- Frontend (React/Next.js) for user interface
- Backend (Node.js) for game logic and session management
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import numpy as np
import joblib
import uvicorn
import os

# Import the FER Transformer model
from fer_transformer import FERTransformer

# Initialize FastAPI application with metadata
app = FastAPI(
    title="Landmark-based Emotion Detection App", 
    description="Detect emotions from facial landmarks using FER Transformer",
    version="1.0.0"
)

# Configure CORS middleware to allow cross-origin requests
# This is necessary for the frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://joyverse.vercel.app",  # Production frontend
        "https://osmium05-landmark-emotion.hf.space",  # Hugging Face Space
        "https://joyverse-l1wm.onrender.com",  # Backend service
        "*"  # Allow all origins for testing
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Mount static files directory for serving assets (if it exists)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure Jinja2 templates for HTML responses (if directory exists)
if os.path.exists("templates"):
    templates = Jinja2Templates(directory="templates")

# Input format for landmarks
class LandmarkInput(BaseModel):
    landmarks: list  # Should be a list of 936 floats (468 landmarks * 2 coordinates)

# Initialize the emotion detection model
print("Loading FER Transformer model...")
try:
    # Load the pre-trained FER Transformer model for landmark-based emotion recognition
    model = FERTransformer()
    model.load_state_dict(torch.load("best_fer_transformer.pth", map_location=torch.device("cpu")))
    model.eval()
    
    # Load label encoder
    label_encoder = joblib.load("label_encoder.pkl")
    
    print("FER Transformer model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    label_encoder = None

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the main HTML page"""
    if os.path.exists("templates"):
        return templates.TemplateResponse("index.html", {"request": request})
    else:
        return HTMLResponse("""
        <html>
            <head><title>Landmark-based Emotion Detection</title></head>
            <body>
                <h1>Landmark-based Emotion Detection API</h1>
                <p>This API detects emotions from facial landmarks.</p>
                <p>Send POST requests to /detect_emotion with landmarks data.</p>
            </body>
        </html>
        """)

@app.post("/detect_emotion")
async def detect_emotion(request: Request):
    """Detect emotion from facial landmarks - endpoint for game integration"""
    try:
        if model is None or label_encoder is None:
            print("Error: Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Get JSON data
        data = await request.json()
        landmarks = data.get("landmarks")
        
        if not landmarks:
            print("Error: No landmarks data provided")
            raise HTTPException(status_code=400, detail="No landmarks data provided")
        
        # Validate landmarks length
        if len(landmarks) != 936:
            print(f"Error: Expected 936 landmarks, got {len(landmarks)}")
            raise HTTPException(status_code=400, detail=f"Expected 936 landmarks, got {len(landmarks)}")
        
        print(f"Processing emotion detection with {len(landmarks)} landmarks...")
        
        # Convert landmarks to tensor
        x = torch.tensor(landmarks, dtype=torch.float32).unsqueeze(0)  # Shape: (1, 936)
        
        # Run emotion detection
        with torch.no_grad():
            outputs = model(x)
            # Get prediction probabilities
            probabilities = torch.softmax(outputs, dim=1)
            pred = outputs.argmax(dim=1).item()
            confidence = probabilities[0][pred].item()
            
            # Get emotion label
            emotion = label_encoder.inverse_transform([pred])[0]
        
        # Return in the format expected by the frontend
        response = {
            "emotion": emotion.lower(),
            "confidence": round(confidence, 3)
        }
        
        print(f"Detected emotion: {response}")
        
        return JSONResponse(response)
        
    except Exception as e:
        print(f"Error in detect_emotion: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Emotion detection failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_type": "FER Transformer (Landmark-based)",
        "expected_input": "936 facial landmarks"
    }

if __name__ == "__main__":
    print("Starting landmark-based emotion detection server")
    uvicorn.run(app, host="0.0.0.0", port=7860, log_level="info")
