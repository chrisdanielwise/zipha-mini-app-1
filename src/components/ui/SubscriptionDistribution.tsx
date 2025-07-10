"use client";

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart3, Users, Crown, User, Shield } from 'lucide-react';

const subscriptionData = [
  { name: 'Premium Plan', value: 1250, color: '#3B82F6', price: 49.99, features: ['Unlimited access', 'Priority support', 'Advanced analytics'] },
  { name: 'Basic Plan', value: 850, color: '#10B981', price: 19.99, features: ['Standard access', 'Email support', 'Basic analytics'] },
  { name: 'Enterprise Plan', value: 320, color: '#F59E0B', price: 99.99, features: ['Custom solutions', 'Dedicated support', 'White-label'] },
  { name: 'Free Plan', value: 180, color: '#EF4444', price: 0, features: ['Limited access', 'Community support'] },
];

const monthlyTrends = [
  { month: 'Jan', premium: 1100, basic: 750, enterprise: 280, free: 150 },
  { month: 'Feb', premium: 1150, basic: 780, enterprise: 290, free: 160 },
  { month: 'Mar', premium: 1180, basic: 800, enterprise: 300, free: 165 },
  { month: 'Apr', premium: 1200, basic: 820, enterprise: 310, free: 170 },
  { month: 'May', premium: 1220, basic: 830, enterprise: 315, free: 175 },
  { month: 'Jun', premium: 1250, basic: 850, enterprise: 320, free: 180 },
];

const chartTypes = [
  { key: 'pie', label: 'Pie Chart', icon: PieIcon },
  { key: 'bar', label: 'Bar Chart', icon: BarChart3 },
];

export default function SubscriptionDistribution() {
  const [selectedChart, setSelectedChart] = useState('pie');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const totalSubscribers = subscriptionData.reduce((sum, plan) => sum + plan.value, 0);

  const renderChart = () => {
    switch (selectedChart) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                onClick={(data) => setSelectedPlan(data.name)}
              >
                {subscriptionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={selectedPlan === entry.name ? '#1F2937' : 'transparent'}
                    strokeWidth={selectedPlan === entry.name ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any) => [
                  `${value} subscribers (${((value / totalSubscribers) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
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
              <Bar dataKey="premium" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="basic" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="enterprise" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              <Bar dataKey="free" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Premium Plan':
        return <Crown className="w-4 h-4" />;
      case 'Basic Plan':
        return <User className="w-4 h-4" />;
      case 'Enterprise Plan':
        return <Shield className="w-4 h-4" />;
      case 'Free Plan':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <PieIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Subscription Distribution</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Plan breakdown and trends</p>
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
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <type.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {renderChart()}
      </div>

      {/* Plan Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subscriptionData.map((plan) => (
          <div
            key={plan.name}
            className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
              selectedPlan === plan.name
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600'
            }`}
            onClick={() => setSelectedPlan(selectedPlan === plan.name ? null : plan.name)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: plan.color }}>
                {getPlanIcon(plan.name)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{plan.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ${plan.price}/month
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">Subscribers</span>
                <p className="font-bold text-gray-800 dark:text-white">{plan.value}</p>
              </div>
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">Percentage</span>
                <p className="font-bold text-gray-800 dark:text-white">
                  {((plan.value / totalSubscribers) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                <p className="font-bold text-gray-800 dark:text-white">
                  ${(plan.value * plan.price).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedPlan === plan.name && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Features:</p>
                <ul className="space-y-0.5">
                  {plan.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{totalSubscribers.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            ${subscriptionData.reduce((sum, plan) => sum + (plan.value * plan.price), 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Plan Price</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${(subscriptionData.reduce((sum, plan) => sum + plan.price, 0) / subscriptionData.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
} 