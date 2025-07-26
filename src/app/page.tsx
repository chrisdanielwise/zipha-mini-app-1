"use client";

import LayoutWrapper from '../components/ui/LayoutWrapper';
import WaterDropCard from '../components/ui/WaterDropCard';
import StatisticsCards from '../components/ui/StatisticsCards';
import ProfitSection from '../components/ui/ProfitSection';
import RevenueTrends from '../components/ui/RevenueTrends';
import UserGrowth from '../components/ui/UserGrowth';
import Receipts from '../components/ui/Receipts';
import SubscriptionDistribution from '../components/ui/SubscriptionDistribution';
import { DollarSign, TrendingUp, Clock, User, CreditCard, Gift, UserPlus, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      type: 'subscription',
      user: 'John Smith',
      action: 'Upgraded to Premium Plan',
      time: '2 minutes ago',
      icon: CreditCard,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 2,
      type: 'user',
      user: 'Sarah Davis',
      action: 'New user registered',
      time: '15 minutes ago',
      icon: UserPlus,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 3,
      type: 'coupon',
      user: 'Mike Wilson',
      action: 'Redeemed coupon SAVE20',
      time: '1 hour ago',
      icon: Gift,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 4,
      type: 'payment',
      user: 'Emma Brown',
      action: 'Payment failed - retry needed',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 5,
      type: 'subscription',
      user: 'David Lee',
      action: 'Cancelled subscription',
      time: '3 hours ago',
      icon: User,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  return (
    <LayoutWrapper>
      <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full max-w-7xl mx-auto pb-8">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your subscription business today.</p>
        </div>

        {/* Statistics Cards (PC only) */}
        <StatisticsCards />

        {/* Average Subscription and Growth Rate cards (PC only) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Profit Section */}
        <ProfitSection />

        {/* RevenueTrends and UserGrowth charts (immediately after ProfitSection) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WaterDropCard variant="elevated">
            <RevenueTrends />
          </WaterDropCard>
          <WaterDropCard variant="elevated">
            <UserGrowth />
          </WaterDropCard>
        </div>

        {/* Recent Activity and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <WaterDropCard variant="elevated">
            <Receipts />
          </WaterDropCard>
          <WaterDropCard variant="elevated">
            <SubscriptionDistribution />
          </WaterDropCard>
          
          {/* Recent Activity Card */}
          <WaterDropCard variant="elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                View all activity
              </button>
            </div>
          </WaterDropCard>
        </div>
      </div>
    </LayoutWrapper>
  );
} 