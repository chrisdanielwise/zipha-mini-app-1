"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="relative">
              <FaLock className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-8 pr-12 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaSignInAlt className="w-4 h-4" />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 