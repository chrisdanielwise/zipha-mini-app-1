"use client";

import React from 'react';
import WaterDropCard from '../../../components/ui/WaterDropCard';
import { FaInfoCircle, FaShieldAlt, FaUsers, FaHeart } from 'react-icons/fa';

const AboutSettingsClient = () => {
  return (
    <div className="flex flex-col gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">About Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account information and preferences</p>
      </div>

      {/* About Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FaInfoCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Account Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View and edit your account details</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="text-gray-800 dark:text-white font-medium">Admin User</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-800 dark:text-white font-medium">admin@zipha.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="text-gray-800 dark:text-white font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Privacy Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your privacy preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Collection</span>
                <span className="text-green-600 dark:text-green-400 text-sm">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Analytics</span>
                <span className="text-green-600 dark:text-green-400 text-sm">Enabled</span>
              </div>
            </div>
          </div>
        </WaterDropCard>
      </div>
    </div>
  );
};

export default AboutSettingsClient; 