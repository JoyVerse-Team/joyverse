# mainapi.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import numpy as np
import joblib

from fer_transformer import FERTransformer  # ✅ Import your model architecture

app = FastAPI()

# ✅ Load model
model = FERTransformer()
model.load_state_dict(torch.load("best_fer_transformer.pth", map_location=torch.device("cpu")))
model.eval()

# ✅ Load label encoder
label_encoder = joblib.load("label_encoder.pkl")

# 🚀 Input format
class LandmarkInput(BaseModel):
    landmarks: list  # Should be a list of 936 floats

@app.post("/predict")
def predict_emotion(data: LandmarkInput):
    if len(data.landmarks) != 936:
        raise HTTPException(status_code=400, detail="Expected 936 landmarks.")

    x = torch.tensor(data.landmarks, dtype=torch.float32).unsqueeze(0)  # Shape: (1, 936)
    with torch.no_grad():
        outputs = model(x)
        pred = outputs.argmax(dim=1).item()
        emotion = label_encoder.inverse_transform([pred])[0]
    return {"emotion": emotion}
