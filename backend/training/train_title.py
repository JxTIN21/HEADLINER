import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import T5ForConditionalGeneration, T5Tokenizer
from torch.optim import AdamW
from sklearn.metrics import f1_score
import numpy as np
from tqdm import tqdm
import os
from utils import calculate_token_f1

# Set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Create output directory for model
os.makedirs('models/title_generator', exist_ok=True)

# Load data
train_df = pd.read_csv('data/train.csv')[:10000]
val_df = pd.read_csv('data/val.csv')[:100]

print(f"Training samples: {len(train_df)}")
print(f"Validation samples: {len(val_df)}")

# Initialize model and tokenizer
tokenizer = T5Tokenizer.from_pretrained('t5-small')
model = T5ForConditionalGeneration.from_pretrained('t5-small')
model.to(device)

# Dataset class
class ArticleTitleDataset(Dataset):
    def __init__(self, dataframe, tokenizer, max_input_length=512, max_target_length=50):
        self.data = dataframe
        self.tokenizer = tokenizer
        self.max_input_length = max_input_length
        self.max_target_length = max_target_length
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, index):
        article = str(self.data.iloc[index]['input'])
        title = str(self.data.iloc[index]['target'])
        
        # Prepare inputs for T5
        source_encoding = self.tokenizer(
            "summarize: " + article,
            max_length=self.max_input_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        
        target_encoding = self.tokenizer(
            title,
            max_length=self.max_target_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        
        input_ids = source_encoding.input_ids.squeeze()
        attention_mask = source_encoding.attention_mask.squeeze()
        labels = target_encoding.input_ids.squeeze()
        labels[labels == 0] = -100  # Replace padding token id's with -100 so they are ignored in loss calculation
        
        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "labels": labels
        }

# Create datasets and dataloaders
train_dataset = ArticleTitleDataset(train_df, tokenizer)
val_dataset = ArticleTitleDataset(val_df, tokenizer)

train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=4, shuffle=False)

# Training parameters
optimizer = AdamW(model.parameters(), lr=2e-5)
num_epochs = 3
best_f1 = 0.0

# Training loop
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    
    progress_bar = tqdm(enumerate(train_loader), total=len(train_loader))
    for batch_idx, batch in progress_bar:
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)
        
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels
        )
        
        loss = outputs.loss
        total_loss += loss.item()
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        progress_bar.set_description(f"Epoch {epoch+1} Loss: {loss.item():.4f}")
    
    avg_train_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch+1} - Average training loss: {avg_train_loss:.4f}")
    
    # Validation
    model.eval()
    val_loss = 0
    references = []
    predictions = []
    
    with torch.no_grad():
        for batch in tqdm(val_loader, desc="Validating"):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )
            
            val_loss += outputs.loss.item()
            
            # Generate predictions
            generated_ids = model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_length=50,
                num_beams=4,
                early_stopping=True
            )
            
            # Decode predictions and actual titles
            pred_titles = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
            actual_titles = []
            
            for label in labels:
                # Replace -100 with pad token ID for decoding
                label_fixed = torch.where(label == -100, tokenizer.pad_token_id, label)
                actual_title = tokenizer.decode(label_fixed, skip_special_tokens=True)
                actual_titles.append(actual_title)
            
            references.extend(actual_titles)
            predictions.extend(pred_titles)
    
    avg_val_loss = val_loss / len(val_loader)
    
    # Calculate token-level F1 score
    f1_scores = [calculate_token_f1(ref, pred) for ref, pred in zip(references, predictions)]
    avg_f1 = sum(f1_scores) / len(f1_scores)
    
    print(f"Validation Loss: {avg_val_loss:.4f}")
    print(f"F1 Score: {avg_f1:.4f}")
    
    # Save best model
    if avg_f1 > best_f1:
        best_f1 = avg_f1
        print(f"New best F1 score: {best_f1:.4f}. Saving model...")
        model.save_pretrained('models/title_generator')
        tokenizer.save_pretrained('models/title_generator')

print("Training completed!")