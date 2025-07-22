import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

// Centralized error message extraction utility
export const getErrorMessage = (err) => {
  if (!err) return 'Something went wrong'
  
  // Handle string errors
  if (typeof err === 'string') return err
  
  // Handle error objects with message property
  if (err.message && typeof err.message === 'string') return err.message
  
  // Handle specific error types
  if (err.code !== undefined) {
    // GeolocationPositionError or similar
    switch (err.code) {
      case 1: return 'Permission denied'
      case 2: return 'Position unavailable'  
      case 3: return 'Request timeout'
      default: return `Error code ${err.code}`
    }
  }
  
  // Handle toString method
  if (err.toString && typeof err.toString === 'function') {
    const stringified = err.toString()
    return stringified !== '[object Object]' ? stringified : 'An error occurred'
  }
  
  // Handle plain objects with relevant properties
  if (typeof err === 'object') {
    const props = ['error', 'description', 'detail', 'reason']
    for (const prop of props) {
      if (err[prop] && typeof err[prop] === 'string') {
        return err[prop]
      }
    }
  }
  
  // Fallback for any other case
  return 'An unexpected error occurred'
}

function Error({ error, onRetry, type = 'general' }) {
  const errorMessage = getErrorMessage(error)

  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'location':
        return 'MapPin'
      case 'weather':
        return 'CloudOff'
      default:
        return 'AlertCircle'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
<div className="mb-4 p-4 rounded-full bg-error/20">
        <ApperIcon 
          name={getErrorIcon()} 
          className="w-8 h-8 text-error" 
        />
      </div>
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
      </motion.button>
    )}
  </motion.div>
);
}

export default Error;