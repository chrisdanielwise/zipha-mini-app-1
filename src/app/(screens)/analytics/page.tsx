"use client";

import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';
import WaterDropCard from '../../../components/ui/WaterDropCard';
import RevenueTrends from '../../../components/ui/RevenueTrends';
import UserGrowth from '../../../components/ui/UserGrowth';
import SubscriptionDistribution from '../../../components/ui/SubscriptionDistribution';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const analyticsData = useMemo(() => ({
    overview: {
      totalRevenue: 12450.75,
      totalSubscribers: 1247,
      activeSubscriptions: 892,
      churnRate: 2.3,
      revenueGrowth: 12.5,
      subscriberGrowth: 8.2,
      subscriptionGrowth: 15.7,
      churnChange: -0.8
    },
    topPerformers: [
      { name: 'VIP Plan', revenue: 6540.50, subscribers: 234, growth: 18.2 },
      { name: 'Premium Plan', revenue: 4320.25, subscribers: 456, growth: 12.8 },
      { name: 'Basic Plan', revenue: 1590.00, subscribers: 557, growth: 5.4 }
    ],
    recentActivity: [
      { type: 'subscription', user: 'John Smith', action: 'Upgraded to VIP', amount: 99.99, time: '2 hours ago' },
      { type: 'payment', user: 'Sarah Johnson', action: 'Monthly payment', amount: 49.99, time: '4 hours ago' },
      { type: 'cancellation', user: 'Mike Wilson', action: 'Cancelled subscription', amount: 0, time: '6 hours ago' },
      { type: 'subscription', user: 'Emily Davis', action: 'New subscriber', amount: 29.99, time: '8 hours ago' }
    ]
  }), []);

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">Analytics</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Comprehensive insights into your subscription business</p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <WaterDropCard variant="elevated" className="p-3 md:p-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
                ${analyticsData.overview.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                  +{analyticsData.overview.revenueGrowth}%
                </span>
              </div>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard variant="elevated" className="p-3 md:p-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscribers</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
                {analyticsData.overview.totalSubscribers.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analyticsData.overview.subscriberGrowth)}
                <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.subscriberGrowth)}`}>
                  +{analyticsData.overview.subscriberGrowth}%
                </span>
              </div>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard variant="elevated" className="p-3 md:p-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Active Subscriptions</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
                {analyticsData.overview.activeSubscriptions.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analyticsData.overview.subscriptionGrowth)}
                <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.subscriptionGrowth)}`}>
                  +{analyticsData.overview.subscriptionGrowth}%
                </span>
              </div>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Activity className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </WaterDropCard>

        <WaterDropCard variant="elevated" className="p-3 md:p-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Churn Rate</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
                {analyticsData.overview.churnRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analyticsData.overview.churnChange)}
                <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.churnChange)}`}>
                  {analyticsData.overview.churnChange > 0 ? '+' : ''}{analyticsData.overview.churnChange}%
                </span>
              </div>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Target className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </WaterDropCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Revenue Trends */}
        <WaterDropCard variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <LineChart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Trends</h3>
            </div>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none"
            >
              <option value="revenue">Revenue</option>
              <option value="subscribers">Subscribers</option>
              <option value="growth">Growth Rate</option>
            </select>
          </div>
          <RevenueTrends />
        </WaterDropCard>

        {/* User Growth */}
        <WaterDropCard variant="elevated" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Growth</h3>
          </div>
          <UserGrowth />
        </WaterDropCard>

        {/* Subscription Distribution */}
        <WaterDropCard variant="elevated" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Subscription Distribution</h3>
          </div>
          <SubscriptionDistribution />
        </WaterDropCard>

        {/* Top Performing Plans */}
        <WaterDropCard variant="elevated" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Performing Plans</h3>
          </div>
          <div className="space-y-3">
            {analyticsData.topPerformers.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{plan.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{plan.subscribers} subscribers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">${plan.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(plan.growth)}
                    <span className={`text-xs font-medium ${getGrowthColor(plan.growth)}`}>
                      +{plan.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WaterDropCard>
      </div>

      {/* Recent Activity */}
      <WaterDropCard variant="elevated" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'subscription' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-blue-500' :
                  'bg-red-500'
                }`}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.user}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {activity.amount > 0 ? `$${activity.amount}` : 'Free'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </WaterDropCard>

      {/* Bottom spacing */}
      <div className="h-8 md:h-20"></div>
    </div>
  );
} 