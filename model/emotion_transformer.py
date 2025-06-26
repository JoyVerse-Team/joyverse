import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pandas as pd
import numpy as np
from torch.utils.data import Dataset, DataLoader
from tqdm import tqdm
import matplotlib.pyplot as plt

# ---------------- Dataset ----------------
class LandmarkDataset(Dataset):
    def __init__(self, features, labels):
        self.features = features
        self.labels = labels
        
    def __len__(self):
        return len(self.features)
    
    def __getitem__(self, idx):
        x = torch.tensor(self.features[idx], dtype=torch.float32)
        y = torch.tensor(self.labels[idx], dtype=torch.long)
        return x, y

# --------------- Model -------------------
class EmotionTransformer(nn.Module):
    def __init__(self, input_dim=3, seq_len=468, model_dim=64, num_heads=4, num_classes=6):
        super(EmotionTransformer, self).__init__()
        self.input_fc = nn.Linear(input_dim, model_dim)
        self.ln1 = nn.LayerNorm(model_dim)  # LayerNorm to stabilize input to Transformer

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=model_dim,
            nhead=num_heads,
            dim_feedforward=128,
            dropout=0.1,
            batch_first=True,
            activation="gelu",  # more stable than ReLU for Transformers
            norm_first=True     # stabilize early
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=2)

        self.fc_out = nn.Sequential(
            nn.Flatten(),
            nn.Linear(model_dim * seq_len, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.input_fc(x)         # (B, 468, 3) → (B, 468, model_dim)
        x = self.ln1(x)              # Normalize before transformer
        x = self.transformer_encoder(x)
        out = self.fc_out(x)
        return out

# --------------- Training -----------------
def train_model(model, train_loader, val_loader, device, epochs=10):
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3)

    train_losses = []
    train_accuracies = []
    val_accuracies = []

    for epoch in range(epochs):
        model.train()
        total_loss = 0
        correct = 0
        total = 0

        print(f"\nEpoch {epoch + 1}/{epochs} ----------------------")

        for x_batch, y_batch in tqdm(train_loader, desc=f"Training Epoch {epoch+1}", leave=False):
            x_batch, y_batch = x_batch.to(device), y_batch.to(device)
            outputs = model(x_batch)
            loss = criterion(outputs, y_batch)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

            preds = torch.argmax(outputs, dim=1)
            correct += (preds == y_batch).sum().item()
            total += y_batch.size(0)

        avg_loss = total_loss / len(train_loader)
        train_acc = (correct / total) *100
        val_acc = evaluate(model, val_loader, device)

        train_losses.append(avg_loss)
        train_accuracies.append(train_acc)
        val_accuracies.append(val_acc)

        print(f"🟢 Training Loss: {avg_loss:.4f}")
        print(f"✅ Training Accuracy: {train_acc:.2f}%")
        print(f"🔵 Validation Accuracy: {val_acc * 100:.2f}%")

    print(f"\n🎯 Final Validation Accuracy: {val_accuracies[-1]:.4f}")
    print("🎉 Training completed. Model ready!")

    



# --------------- Evaluation -----------------
def evaluate(model, val_loader, device):
    model.eval()
    y_true, y_pred = [], []
    with torch.no_grad():
        for x_batch, y_batch in val_loader:
            x_batch = x_batch.to(device)
            outputs = model(x_batch)
            preds = torch.argmax(outputs, dim=1).cpu().numpy()
            y_true.extend(y_batch.numpy())
            y_pred.extend(preds)
    acc = accuracy_score(y_true, y_pred)
    return acc


# --------------- Main Pipeline -----------------
def main(csv_path):
   
    df = pd.read_csv(csv_path)

    # Remove rows with missing or infinite values
    df = df.replace([np.inf, -np.inf], np.nan).dropna()

    # Keep only labels that appear more than once
    label_counts = df['emotion'].value_counts()
    df = df[df['emotion'].isin(label_counts[label_counts > 1].index)]

    # Select landmark columns (x_, y_, z_)
    feature_cols = [col for col in df.columns if any(axis in col for axis in ['x_', 'y_', 'z_'])]

    # Normalize features
    features = df[feature_cols].values
    features = (features - np.mean(features, axis=0)) / (np.std(features, axis=0) + 1e-6)

    features = features.reshape(-1, 468, 3)

    le = LabelEncoder()
    labels = le.fit_transform(df['emotion'])

    X_train, X_val, y_train, y_val = train_test_split(
        features, labels, stratify=labels, test_size=0.2, random_state=42
    )

    train_ds = LandmarkDataset(X_train, y_train)
    val_ds = LandmarkDataset(X_val, y_val)

    train_loader = DataLoader(train_ds, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=32)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = EmotionTransformer().to(device)
    train_model(model, train_loader, val_loader, device)

    print("🎉 Training completed. Model ready!")
    return model, le

# ---------- Run ----------
if __name__ == "__main__":
    model, le = main(r"C:\Users\Sneha\Downloads\JoyVerseDataSet.csv")



