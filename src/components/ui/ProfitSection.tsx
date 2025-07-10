"use client";

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ChevronDown } from 'lucide-react';
import WaterDropCard from './WaterDropCard';

const profitData = {
  all: { 
    amount: "$50,500.00", 
    text: "+20% since last month",
    trend: "up",
    chartData: [
      { month: 'Jan', value: 35000 },
      { month: 'Feb', value: 42000 },
      { month: 'Mar', value: 38000 },
      { month: 'Apr', value: 45000 },
      { month: 'May', value: 48000 },
      { month: 'Jun', value: 50500 },
    ]
  },
  weekly: { 
    amount: "$12,233.20", 
    text: "+14% since last week",
    trend: "up",
    chartData: [
      { day: 'Mon', value: 8500 },
      { day: 'Tue', value: 9200 },
      { day: 'Wed', value: 8800 },
      { day: 'Thu', value: 10500 },
      { day: 'Fri', value: 11200 },
      { day: 'Sat', value: 12233 },
    ]
  },
  monthly: { 
    amount: "$45,000.00", 
    text: "+18% since last month",
    trend: "up",
    chartData: [
      { week: 'W1', value: 38000 },
      { week: 'W2', value: 42000 },
      { week: 'W3', value: 41000 },
      { week: 'W4', value: 45000 },
    ]
  },
};

const timeOptions = [
  { key: 'weekly', label: 'This Week', icon: Calendar },
  { key: 'monthly', label: 'This Month', icon: Calendar },
  { key: 'all', label: 'All Time', icon: Calendar },
];

export default function ProfitSection() {
  const [selectedOption, setSelectedOption] = useState('weekly');
  const [menuOpen, setMenuOpen] = useState(false);

  const currentData = profitData[selectedOption as keyof typeof profitData];
  const gradientId = `profit-gradient-${selectedOption}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profit Card */}
      <WaterDropCard variant="floating" className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Overview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your earnings</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {timeOptions.find(opt => opt.key === selectedOption)?.label}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-12 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 min-w-[140px] border border-gray-200 dark:border-gray-700">
                {timeOptions.map((option) => (
                  <button
                    key={option.key}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-sm font-medium transition-colors"
                    onClick={() => {
                      setSelectedOption(option.key);
                      setMenuOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="h-40 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData.chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
              <XAxis 
                dataKey={selectedOption === 'weekly' ? 'day' : selectedOption === 'monthly' ? 'week' : 'month'} 
                stroke="#6B7280" 
                fontSize={12}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={3}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{currentData.text}</p>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{currentData.amount}</h2>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            currentData.trend === 'up' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}>
            {currentData.trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">+20.1%</span>
          </div>
        </div>
      </WaterDropCard>

      {/* Quick Stats */}
      <div className="space-y-6">
        <WaterDropCard variant="elevated" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Average Subscription</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">$45.20</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">+8% from last month</p>
        </WaterDropCard>

        <WaterDropCard variant="elevated" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Growth Rate</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">+18.2%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">vs last period</p>
        </WaterDropCard>
      </div>
    </div>
  );
} 