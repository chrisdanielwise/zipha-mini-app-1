"use client";

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 42000, subscriptions: 850, growth: 12 },
  { month: 'Feb', revenue: 45000, subscriptions: 920, growth: 15 },
  { month: 'Mar', revenue: 48000, subscriptions: 980, growth: 18 },
  { month: 'Apr', revenue: 52000, subscriptions: 1050, growth: 22 },
  { month: 'May', revenue: 55000, subscriptions: 1120, growth: 25 },
  { month: 'Jun', revenue: 58000, subscriptions: 1180, growth: 28 },
  { month: 'Jul', revenue: 62000, subscriptions: 1250, growth: 32 },
  { month: 'Aug', revenue: 65000, subscriptions: 1320, growth: 35 },
];

const chartTypes = [
  { key: 'line', label: 'Line Chart', icon: TrendingUp },
  { key: 'area', label: 'Area Chart', icon: TrendingUp },
  { key: 'bar', label: 'Bar Chart', icon: TrendingUp },
];

export default function RevenueTrends() {
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const renderChart = () => {
    const gradientId = `revenue-gradient-${selectedChart}`;
    
    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
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
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                stroke="#10B981" 
                strokeWidth={3}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
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
                fill="#10B981"
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Trends</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly subscription revenue analysis</p>
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
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
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
          onClick={() => setSelectedMetric('revenue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'revenue'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Revenue
        </button>
        <button
          onClick={() => setSelectedMetric('subscriptions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'subscriptions'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setSelectedMetric('growth')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'growth'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Growth %
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        {renderChart()}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">$387,000</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">$48,375</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">+23.5%</p>
        </div>
      </div>
    </div>
  );
} 