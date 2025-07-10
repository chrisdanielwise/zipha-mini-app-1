"use client";

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, TrendingUp, UserPlus, UserCheck } from 'lucide-react';

const userData = [
  { month: 'Jan', active: 1850, new: 120, churned: 45, total: 1925 },
  { month: 'Feb', active: 1980, new: 135, churned: 38, total: 2077 },
  { month: 'Mar', active: 2120, new: 150, churned: 42, total: 2228 },
  { month: 'Apr', active: 2280, new: 165, churned: 35, total: 2410 },
  { month: 'May', active: 2450, new: 180, churned: 40, total: 2590 },
  { month: 'Jun', active: 2620, new: 195, churned: 33, total: 2782 },
  { month: 'Jul', active: 2800, new: 210, churned: 37, total: 2973 },
  { month: 'Aug', active: 2980, new: 225, churned: 30, total: 3175 },
];

const chartTypes = [
  { key: 'line', label: 'Line Chart', icon: TrendingUp },
  { key: 'area', label: 'Area Chart', icon: TrendingUp },
  { key: 'bar', label: 'Bar Chart', icon: TrendingUp },
];

export default function UserGrowth() {
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('active');

  const renderChart = () => {
    const gradientId = `user-gradient-${selectedChart}`;
    
    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey={selectedMetric} 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Growth</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Subscriber acquisition and retention</p>
          </div>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex items-center gap-2">
          {chartTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedChart(type.key)}
              className={`p-2 rounded-lg transition-colors ${
                selectedChart === type.key
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <type.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelectedMetric('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'active'
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Active Users
        </button>
        <button
          onClick={() => setSelectedMetric('new')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'new'
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          New Users
        </button>
        <button
          onClick={() => setSelectedMetric('churned')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'churned'
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Churned Users
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        {renderChart()}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <UserCheck className="w-4 h-4 text-green-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">2,980</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">225</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-red-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Churned</p>
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">30</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Growth</p>
          </div>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">+6.2%</p>
        </div>
      </div>
    </div>
  );
} 