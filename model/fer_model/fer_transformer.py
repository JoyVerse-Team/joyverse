# fer_transformer.py
import torch
import torch.nn as nn

class FERTransformer(nn.Module):
    def __init__(self, input_dim=936, d_model=256, nhead=8, num_layers=4, num_classes=7):
        super(FERTransformer, self).__init__()
        self.embedding = nn.Linear(input_dim, d_model)
        self.pos_encoding = nn.Parameter(torch.randn(1, 1, d_model))

        encoder_layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=nhead, dim_feedforward=512, activation='gelu')
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.dropout = nn.Dropout(0.3)
        self.norm = nn.LayerNorm(d_model)
        self.fc = nn.Linear(d_model, num_classes)

    def forward(self, x):
        x = self.embedding(x).unsqueeze(1)
        x = x + self.pos_encoding
        x = self.transformer(x)
        x = x.mean(dim=1)
        x = self.norm(x)
        x = self.dropout(x)
        return self.fc(x)
