import os
import cv2
import numpy as np
import pandas as pd
import mediapipe as mp
from tqdm import tqdm

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True)

def extract_landmarks_from_folder(folder_path):
    all_data = []
    all_labels = []

    # Loop over each emotion folder
    for emotion_label in os.listdir(folder_path):
        emotion_dir = os.path.join(folder_path, emotion_label)
        if not os.path.isdir(emotion_dir):
            continue

        print(f"📁 Processing: {emotion_label}")
        for img_name in tqdm(os.listdir(emotion_dir), desc=emotion_label):
            img_path = os.path.join(emotion_dir, img_name)

            # Read and preprocess the image
            img = cv2.imread(img_path)
            if img is None:
                continue
            img = cv2.resize(img, (192, 192))
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Extract facial landmarks
            results = face_mesh.process(img_rgb)
            if results.multi_face_landmarks:
                landmarks = results.multi_face_landmarks[0].landmark
                coords = []
                for lm in landmarks:
                    coords.extend([lm.x, lm.y])
                if len(coords) == 936:  # 468 points * 2 (x, y)
                    all_data.append(coords)
                    all_labels.append(emotion_label)

    return pd.DataFrame(all_data), all_labels

# Process TRAIN folder
train_df, train_labels = extract_landmarks_from_folder('train')
train_df['label'] = train_labels
train_df.to_csv('cleaned_landmark_train.csv', index=False)
print("✅ Saved cleaned_landmark_train.csv")

# Process TEST folder
test_df, test_labels = extract_landmarks_from_folder('test')
test_df['label'] = test_labels
test_df.to_csv('cleaned_landmark_test.csv', index=False)
print("✅ Saved cleaned_landmark_test.csv")
