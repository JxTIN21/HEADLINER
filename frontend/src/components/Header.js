import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">HEADLINER</h1>
              <p className="text-sm text-gray-500">AI-Powered Title & Summary Generator</p>
            </div>
          </div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
              BERT + T5
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              High Accuracy
            </span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;