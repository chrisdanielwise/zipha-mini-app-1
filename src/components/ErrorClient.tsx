"use client";

import React from 'react';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorClient = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h1>
          <p className="text-gray-600 dark:text-gray-300">Something went wrong. Please try again.</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <FaHome className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorClient; 