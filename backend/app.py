from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertModel, T5ForConditionalGeneration, T5Tokenizer
import pandas as pd
import numpy as np
from sklearn.metrics import f1_score
import os
import tempfile
import docx
import pdfplumber

app = Flask(__name__)
CORS(app)

# Load pre-trained models
title_tokenizer = T5Tokenizer.from_pretrained('models/title_generator')
title_model = T5ForConditionalGeneration.from_pretrained('models/title_generator')

summary_tokenizer = T5Tokenizer.from_pretrained('models/summary_generator')
summary_model = T5ForConditionalGeneration.from_pretrained('models/summary_generator')

bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')

# Set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
title_model.to(device)
summary_model.to(device)
bert_model.to(device)

def calculate_f1(reference, prediction):
    """Calculate token-level F1 score"""
    ref_tokens = reference.lower().split()
    pred_tokens = prediction.lower().split()
    
    common = set(ref_tokens) & set(pred_tokens)
    
    if not common:
        return 0.0
    
    precision = len(common) / len(pred_tokens)
    recall = len(common) / len(ref_tokens)
    
    if precision + recall == 0:
        return 0.0
    
    f1 = 2 * (precision * recall) / (precision + recall)
    return f1

def process_text(text):
    # Encode text with BERT
    inputs = bert_tokenizer(text, return_tensors="pt", padding=True, 
                            truncation=True, max_length=512).to(device)
    with torch.no_grad():
        bert_outputs = bert_model(**inputs)
    
    # Generate title
    title_inputs = title_tokenizer("summarize: " + text, return_tensors="pt", padding=True, 
                                   truncation=True, max_length=512).to(device)
    title_outputs = title_model.generate(
        title_inputs.input_ids,
        max_length=50,
        min_length=5,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    title = title_tokenizer.decode(title_outputs[0], skip_special_tokens=True)
    
    # Generate summary
    summary_inputs = summary_tokenizer("summarize: " + text, return_tensors="pt", 
                                       padding=True, truncation=True, max_length=512).to(device)
    summary_outputs = summary_model.generate(
        summary_inputs.input_ids,
        max_length=150,
        min_length=40,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    summary = summary_tokenizer.decode(summary_outputs[0], skip_special_tokens=True)
    
    # Placeholder F1 scores
    title_f1 = 0.85
    summary_f1 = 0.78
    
    return {
        "title": title,
        "summary": summary,
        "title_f1": title_f1,
        "summary_f1": summary_f1
    }

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    full_text = [para.text for para in doc.paragraphs]
    return '\n'.join(full_text)

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

@app.route('/api/generate', methods=['POST'])
def generate():
    if 'text' in request.json:
        text = request.json['text']
        return jsonify(process_text(text))
    
    return jsonify({"error": "No text provided"}), 400

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    try:
        file.save(temp_file.name)
        temp_file.close()  # Ensure file is closed before using

        if file.filename.endswith('.docx'):
            text = extract_text_from_docx(temp_file.name)
        elif file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(temp_file.name)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        return jsonify(process_text(text))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            os.unlink(temp_file.name)
        except Exception as cleanup_error:
            print(f"Error deleting temp file: {cleanup_error}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)