import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ results }) => {
  const { title, summary, title_f1, summary_f1 } = results;
  
  const formatF1Score = (score) => {
    return (score * 100).toFixed(1) + '%';
  };
  
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div 
      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Generated Title</h3>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">F1 Score:</span>
              <span className={`text-sm font-semibold ${getScoreColor(title_f1)}`}>
                {formatF1Score(title_f1)}
              </span>
            </div>
          </div>
          <motion.div 
            className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xl font-bold text-gray-800">{title}</h4>
          </motion.div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Generated Summary</h3>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">F1 Score:</span>
              <span className={`text-sm font-semibold ${getScoreColor(summary_f1)}`}>
                {formatF1Score(summary_f1)}
              </span>
            </div>
          </div>
          <motion.div 
            className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-700 whitespace-pre-line">{summary}</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => navigator.clipboard.writeText(title)}
          >
            Copy Title
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => navigator.clipboard.writeText(summary)}
          >
            Copy Summary
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultCard;