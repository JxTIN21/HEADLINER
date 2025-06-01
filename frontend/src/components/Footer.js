import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">HEADLINER</h2>
            <p className="text-gray-400 text-sm mt-1">© {new Date().getFullYear()} All rights reserved</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <span className="text-gray-400 text-sm">Powered by:</span>
              <span className="text-primary-400 font-medium text-sm">BERT</span>
              <span className="text-primary-400 font-medium text-sm">T5-small</span>
            </div>
            <p className="text-gray-500 text-xs">Title and Summary Generation using Transformers</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;