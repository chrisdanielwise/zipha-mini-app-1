"use client";

import React from 'react';
import WaterDropCard from '../../../components/ui/WaterDropCard';
import { FaUser, FaLock, FaShieldAlt, FaCog, FaBell, FaPalette } from 'react-icons/fa';

const LoginSettingsClient = () => {
  return (
    <div className="flex flex-col gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account settings and preferences</p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FaUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Profile Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your profile information</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configure
            </button>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FaLock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Password and security settings</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Configure
            </button>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <FaBell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage notification preferences</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Configure
            </button>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <FaPalette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Appearance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Theme and display settings</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Configure
            </button>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FaCog className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">General</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">General application settings</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Configure
            </button>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Privacy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Privacy and data settings</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Configure
            </button>
          </div>
        </WaterDropCard>
      </div>
    </div>
  );
};

export default LoginSettingsClient; 