# HEADLINER
<<<<<<< HEAD
HEADLINER is an AI-powered tool that generates relevant titles and summaries for articles using models like BERT and T5-small. It features a Python backend for inference, a Node.js layer for auth and history, and uses ROUGE, BLEU, and F1 for evaluation. Perfect for content creators and researchers.
=======

HEADLINER is an AI-powered title and summary generation tool that uses state-of-the-art natural language processing models (BERT and T5) to create high-quality, engaging titles and concise summaries for articles.

## Features

- Generate titles and summaries from plain text
- Support for document uploads (DOCX and PDF)
- Show F1 scores for generated content
- Modern, responsive UI with animations
- Pre-trained models included

## Technology Stack

### Backend
- Python with Flask API
- Hugging Face Transformers (BERT, T5)
- PyTorch
- scikit-learn for F1 score evaluation
- Document processing (PDF, DOCX)

### Frontend
- React
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd headliner/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the training scripts (optional, pre-trained models are provided):
   ```
   python training/train_title.py
   python training/train_summary.py
   ```

5. Start the Flask API:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd headliner/frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Usage

1. Enter article text directly in the text area or upload a DOCX/PDF file
2. Click "Generate Title & Summary"
3. View the generated title and summary along with their F1 scores
4. Copy the results to clipboard as needed

## Model Information

- **BERT**: Used for article encoding and feature extraction
- **T5-small**: Used for title and summary generation
- **F1 Score**: Used to evaluate the quality of generated content

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for providing pre-trained transformer models
- The creators of BERT and T5
>>>>>>> 9db1fd86 (Initial commit)
