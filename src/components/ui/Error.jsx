import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

function Error({ error, onRetry, type = 'general' }) {
  // Enhanced error message extraction with proper serialization
  const getErrorMessage = (err) => {
    if (!err) return 'Something went wrong';
    
    // If it's already a string, use it
    if (typeof err === 'string') return err;
    
    // Try to extract message property
    if (err.message && typeof err.message === 'string') return err.message;
    
    // Try to extract error description
    if (err.description && typeof err.description === 'string') return err.description;
    
    // Try toString method, but avoid [object Object]
    if (err.toString && typeof err.toString === 'function') {
      const stringified = err.toString();
      if (stringified !== '[object Object]') return stringified;
    }
    
    // Try to extract any meaningful error info
    if (err.code) return `Error code: ${err.code}`;
    if (err.status) return `Error status: ${err.status}`;
    if (err.statusText) return `Error: ${err.statusText}`;
    
    // Last resort - generic message
    return 'An unexpected error occurred';
  };
  
const errorMessage = getErrorMessage(error);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4"
      >
        <ApperIcon 
          name="AlertTriangle" 
          className="w-16 h-16 text-error mx-auto mb-4" 
        />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {errorMessage}
      </p>
      
      {onRetry && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
Try Again
        </motion.button>
      )}
    </div>
  );
}

export default Error;