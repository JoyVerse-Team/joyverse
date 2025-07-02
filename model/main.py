from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import numpy as np
import joblib
from emotion_transformer import EmotionTransformer

app = FastAPI()

# Load model
model = EmotionTransformer()
model.load_state_dict(torch.load("emotion_transformer_model.pth", map_location=torch.device("cpu")))
model.eval()

# Load label encoder and normalization stats
mean = np.load("C:/Users/Sneha/Desktop/model/mean.npy")
std = np.load("C:/Users/Sneha/Desktop/model/std.npy")
le = joblib.load("C:/Users/Sneha/Desktop/model/label_encoder.joblib")

# Input schema
class LandmarkInput(BaseModel):
    landmarks: list[list[float]]  # 468 x 3

@app.post("/predict")
def predict_emotion(data: LandmarkInput):
    try:
        landmarks = np.array(data.landmarks)
        if landmarks.shape != (468, 3):
            raise ValueError("Expected input shape (468, 3)")

        # Normalize using the training mean and std
        landmarks = (landmarks - mean) / (std + 1e-6)
        tensor = torch.tensor(landmarks, dtype=torch.float32).unsqueeze(0)  # (1, 468, 3)

        with torch.no_grad():
            outputs = model(tensor)
            pred = torch.argmax(outputs, dim=1).item()
            emotion = le.inverse_transform([pred])[0]
            return {"predicted_emotion": emotion}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

