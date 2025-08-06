"use client";

import React, { useState, useEffect } from 'react';
import WaterDropCard from '../../components/ui/WaterDropCard';
import { FaSun, FaMoon, FaPalette, FaEye } from 'react-icons/fa';

const ThemeClient = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Theme Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your app appearance</p>
      </div>

      {/* Theme Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <FaPalette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Theme Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  !isDark 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaSun className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-800 dark:text-white font-medium">Light Mode</span>
                </div>
                {!isDark && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
              </button>
              
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  isDark 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaMoon className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-800 dark:text-white font-medium">Dark Mode</span>
                </div>
                {isDark && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
              </button>
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <FaEye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">See how your theme looks</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Theme:</span>
                <span className="text-gray-800 dark:text-white font-medium">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Auto Switch:</span>
                <span className="text-gray-800 dark:text-white font-medium">Disabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Saved:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Yes</span>
              </div>
            </div>
          </div>
        </WaterDropCard>
      </div>
    </div>
  );
};

export default ThemeClient; 