# HEADLINER

HEADLINER is an AI-powered title and summary generation tool that uses state-of-the-art natural language processing models (BERT and T5) to create high-quality, engaging titles and concise summaries for articles. Perfect for content creators and researchers who need quick, accurate content summarization.

## Features

- Generate titles and summaries from plain text
- Support for document uploads (DOCX and PDF)
- Show F1 scores for generated content quality evaluation
- Modern, responsive UI with animations
- Pre-trained models included for immediate use
- Simple and intuitive interface

## Technology Stack

### Backend
- Python with Flask API
- Hugging Face Transformers (BERT, T5-small)
- PyTorch for model inference
- scikit-learn for F1 score evaluation
- Document processing libraries (PDF, DOCX)

### Frontend
- React
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd headliner/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the training scripts (optional, pre-trained models are provided):
   ```bash
   python training/train_title.py
   python training/train_summary.py
   ```

5. Start the Flask API:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd headliner/frontend
   ```

2. Install the required npm packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
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
- **T5-small**: Used for title and summary generation with transformer architecture
- **F1 Score**: Evaluation metric used to measure the quality and accuracy of generated content

## Evaluation Metrics

The tool uses ROUGE, BLEU, and F1 scores to evaluate the quality of generated titles and summaries, providing users with confidence metrics for the generated content.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for providing pre-trained transformer models
- The creators of BERT and T5 architectures
- The open-source community for the underlying libraries and frameworks
