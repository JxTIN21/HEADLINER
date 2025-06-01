import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const FileUpload = ({ onUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File too large. Maximum size is 10MB.');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Invalid file type. Only .docx and .pdf files are supported.');
      } else {
        setError('File rejected. Please try another file.');
      }
      return;
    }

    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;
    
    // Additional file validation
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!['docx', 'pdf'].includes(fileExtension)) {
      setError('Only .docx and .pdf files are supported');
      return;
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    // Check if file is not empty
    if (selectedFile.size === 0) {
      setError('File appears to be empty. Please select a valid file.');
      return;
    }
    
    console.log('File selected:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
    setFile(selectedFile);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (error) {
      return;
    }

    console.log('Submitting file:', file.name);
    onUpload(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div onSubmit={handleSubmit}>
        <div className="mb-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-primary-500 bg-primary-50' 
                : file && !error
                ? 'border-green-400 bg-green-50'
                : error
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input {...getInputProps()} disabled={isLoading} />
            
            <div className="space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`mx-auto h-12 w-12 ${
                  error ? 'text-red-400' : file ? 'text-green-400' : 'text-gray-400'
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              
              <div>
                <p className="text-gray-700 font-medium">
                  {isLoading 
                    ? 'Processing...' 
                    : isDragActive 
                    ? 'Drop the file here' 
                    : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: .docx, .pdf (Max 10MB)
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-center"
            >
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </motion.div>
          )}
          
          {file && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-green-50 border border-green-200 rounded"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <span className="text-sm text-green-800 font-medium block truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-xs text-green-600">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                {!isLoading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="text-green-600 hover:text-green-800 ml-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
        
        <motion.button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !file || !!error}
          whileHover={!isLoading && file && !error ? { scale: 1.02 } : {}}
          whileTap={!isLoading && file && !error ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Generate Title & Summary'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FileUpload;