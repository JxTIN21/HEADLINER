import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TextInput from './components/TextInput';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';
import './styles/tailwind.css';
import { motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleTextSubmit = async (text) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000); // 1 minute timeout for text processing
    
    try {
      console.log('Submitting text for processing...');
      
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.status === 'error') {
        throw new Error(data.error);
      }
      
      setResults(data);
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Text processing error:', error);
      
      let errorMessage = 'An error occurred while processing text';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try with shorter text or try again later.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the server is running on http://localhost:5000';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 120000); // 2 minutes timeout for file processing
    
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'bytes');
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload response data:', data);
      
      if (data.status === 'error') {
        throw new Error(data.error);
      }
      
      setResults(data);
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('File upload error:', error);
      
      let errorMessage = 'An error occurred while processing the file';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Large files or complex documents may take longer to process. Please try again or use a smaller file.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the server is running on http://localhost:5000';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear results and error when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'text'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-primary-500'
                }`}
                onClick={() => handleTabChange('text')}
                disabled={isLoading}
              >
                Text Input
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'file'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-primary-500'
                }`}
                onClick={() => handleTabChange('file')}
                disabled={isLoading}
              >
                File Upload
              </button>
            </div>

            <div className="mt-6">
              {activeTab === 'text' ? (
                <TextInput onSubmit={handleTextSubmit} isLoading={isLoading} />
              ) : (
                <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />
              )}
            </div>

            {/* Loading State with Progress Information */}
            {isLoading && (
              <motion.div 
                className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-800 font-medium">Processing...</span>
                </div>
                <p className="text-blue-700 text-sm">
                  {activeTab === 'file' 
                    ? 'Please wait...' 
                    : 'Generating title and summary. '}
                </p>
                <div className="mt-3 text-xs text-blue-600">
                  Don't close this page while processing
                </div>
              </motion.div>
            )}

            {/* Error Display with Better Styling */}
            {error && (
              <motion.div 
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-red-800">Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => setError(null)}
                        className="text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Display */}
            {results && !isLoading && (
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ResultCard results={results} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;