import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

export default function Error({ message, onRetry, className = '' }) {
  // Ensure message is always a string and handle edge cases
  const errorMessage = typeof message === 'string' 
    ? message 
    : message?.message || message?.toString?.() || 'An unexpected error occurred';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card rounded-2xl p-8 text-center max-w-md mx-auto ${className}`}
    >
      <div className="mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          size={48} 
          className="text-error mx-auto mb-4" 
        />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {errorMessage}
        </p>
</div>
      
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
        </motion.button>
      )}
    </motion.div>
  );
}