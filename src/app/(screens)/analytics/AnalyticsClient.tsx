"use client";

import React from 'react';
import WaterDropCard from '../../../components/ui/WaterDropCard';
import { FaChartBar, FaUsers, FaDollarSign, FaArrowUp } from 'react-icons/fa';

const AnalyticsClient = () => {
  return (
    <div className="flex flex-col gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">View detailed analytics and insights</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WaterDropCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">1,234</p>
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <FaDollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">$45,678</p>
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <FaArrowUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">+23%</p>
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <FaChartBar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">89%</p>
            </div>
          </div>
        </WaterDropCard>
      </div>

      {/* Main Content */}
      <WaterDropCard>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This analytics page is currently under development. More detailed analytics and charts will be added soon.
          </p>
        </div>
      </WaterDropCard>
    </div>
  );
};

export default AnalyticsClient; 