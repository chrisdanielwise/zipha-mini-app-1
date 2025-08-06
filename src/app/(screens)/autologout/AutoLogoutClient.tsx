"use client";

import React, { useState } from 'react';
import WaterDropCard from '../../../components/ui/WaterDropCard';
import { FaShieldAlt, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AutoLogoutClient = () => {
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(30);

  return (
    <div className="flex flex-col gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Auto Logout Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Configure automatic logout for security</p>
      </div>

      {/* Auto Logout Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Auto Logout</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically log out after inactivity</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Enable Auto Logout</span>
                <button
                  onClick={() => setAutoLogoutEnabled(!autoLogoutEnabled)}
                  className="flex items-center"
                >
                  {autoLogoutEnabled ? (
                    <FaToggleOn className="w-6 h-6 text-green-500" />
                  ) : (
                    <FaToggleOff className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FaClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Current Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your current auto logout configuration</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-sm font-medium ${autoLogoutEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {autoLogoutEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Timeout:</span>
                <span className="text-gray-800 dark:text-white font-medium">{timeoutMinutes} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next logout:</span>
                <span className="text-gray-800 dark:text-white font-medium">
                  {autoLogoutEnabled ? `${timeoutMinutes} min from now` : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </WaterDropCard>
      </div>
    </div>
  );
};

export default AutoLogoutClient; 