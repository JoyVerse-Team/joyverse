"""
FastAPI Emotion Detection Service

This service provides emotion detection capabilities for the Joyverse application.
It uses a pre-trained Vision Transformer (ViT) model to analyze facial expressions
and classify them into 7 basic emotions: happy, sad, angry, fear, surprise, disgust, neutral.

Features:
- Real-time emotion detection from base64 encoded images
- RESTful API endpoints for emotion classification
- CORS support for cross-origin requests
- Static file serving for web interface
- GPU acceleration when available

The service runs on port 8000 and integrates with:
- Frontend (React/Next.js) for user interface
- Backend (Node.js) for game logic and session management
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import base64
from transformers import pipeline, AutoImageProcessor, AutoModelForImageClassification
import torch
import uvicorn

# Initialize FastAPI application with metadata
app = FastAPI(
    title="Emotion Detection App", 
    description="Detect emotions from facial expressions using Vision Transformer",
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

# Mount static files directory for serving assets
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure Jinja2 templates for HTML responses
templates = Jinja2Templates(directory="templates")

# Initialize the emotion detection model
print("Loading emotion detection model...")
try:
    # Load the pre-trained Vision Transformer model for facial expression recognition
    model_name = "mo-thecreator/vit-Facial-Expression-Recognition"
    processor = AutoImageProcessor.from_pretrained(model_name)
    model = AutoModelForImageClassification.from_pretrained(model_name)
    
    # Create pipeline for emotion classification
    # Uses GPU if available, otherwise falls back to CPU
    emotion_pipeline = pipeline(
        "image-classification",
        model=model,
        feature_extractor=processor,
        device=0 if torch.cuda.is_available() else -1  # 0 for GPU, -1 for CPU
    )
    
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    emotion_pipeline = None

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the main HTML page"""
    return templates.TemplateResponse("index.html", {"request": request})



@app.post("/detect_emotion")
async def detect_emotion(request: Request):
    """Detect emotion from base64 image data - endpoint for game integration"""
    try:
        if emotion_pipeline is None:
            print("Error: Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Get JSON data
        data = await request.json()
        image_data = data.get("image")
        
        if not image_data:
            print("Error: No image data provided")
            raise HTTPException(status_code=400, detail="No image data provided")
        
        # Remove data URL prefix if present
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]
        
        print("Processing emotion detection...")
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        print(f"Image size: {image.size}")
        
        # Run emotion detection
        results = emotion_pipeline(image)
        
        # Get the top prediction
        top_prediction = results[0] if results else {"label": "neutral", "score": 0.5}
        
        # Return in the format expected by the frontend
        response = {
            "emotion": top_prediction["label"].lower(),
            "confidence": round(top_prediction["score"], 3)
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
        "model_loaded": emotion_pipeline is not None
    }

if __name__ == "__main__":
    print("Starting server")
    # Use 0.0.0.0 for Hugging Face deployment, localhost for local development
    uvicorn.run(app, host="0.0.0.0", port=7860, log_level="info")
