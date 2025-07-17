from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import base64
import torch
import numpy as np
import cv2
import mediapipe as mp
import joblib
import uvicorn
from fer_transformer import FERTransformer

app = FastAPI(title="Emotion Detection App", description="Detect emotions from facial expressions")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Initialize the emotion detection model
print("Loading emotion detection model...")
emotion_model = None
label_encoder = None

try:
    # Load the custom FER transformer model
    emotion_model = FERTransformer()
    emotion_model.load_state_dict(torch.load("best_fer_transformer.pth", map_location=torch.device("cpu")))
    emotion_model.eval()
    
    # Load label encoder
    label_encoder = joblib.load("label_encoder.pkl")
    
    print("Custom FER model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    emotion_model = None
    label_encoder = None

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the main HTML page"""
    return templates.TemplateResponse("index.html", {"request": request})



@app.post("/detect_emotion")
async def detect_emotion(request: Request):
    """Detect emotion from landmark data - endpoint for game integration"""
    try:
        if emotion_model is None or label_encoder is None:
            print("Error: Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Get JSON data
        data = await request.json()
        landmarks_data = data.get("landmarks")
        
        if not landmarks_data:
            print("Error: No landmarks data provided")
            raise HTTPException(status_code=400, detail="No landmarks data provided")
        
        # Validate landmarks data
        if not isinstance(landmarks_data, list) or len(landmarks_data) != 936:
            print(f"Error: Invalid landmarks data. Expected 936 coordinates, got {len(landmarks_data) if isinstance(landmarks_data, list) else 'non-list'}")
            raise HTTPException(status_code=400, detail="Invalid landmarks data. Expected 936 coordinates (468 landmarks × 2)")
        
        print("Processing emotion detection from landmarks...")
        
        # Convert landmarks to tensor
        landmarks_tensor = torch.tensor(landmarks_data, dtype=torch.float32).unsqueeze(0)  # Shape: (1, 936)
        
        # Run emotion detection
        with torch.no_grad():
            outputs = emotion_model(landmarks_tensor)
            pred = outputs.argmax(dim=1).item()
            confidence = torch.softmax(outputs, dim=1).max().item()
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
        "model_loaded": emotion_model is not None and label_encoder is not None
    }

if __name__ == "__main__":
    print("Starting server")
    uvicorn.run(app, host="localhost", port=8000, log_level="info")
