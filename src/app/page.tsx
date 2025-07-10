"use client";

import WaterDropCard from '../components/ui/WaterDropCard';
import StatisticsCards from '../components/ui/StatisticsCards';
import ProfitSection from '../components/ui/ProfitSection';
import RevenueTrends from '../components/ui/RevenueTrends';
import UserGrowth from '../components/ui/UserGrowth';
import Receipts from '../components/ui/Receipts';
import SubscriptionDistribution from '../components/ui/SubscriptionDistribution';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome back!</h1>
        <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your subscription business today.</p>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Profit Section */}
      <ProfitSection />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WaterDropCard variant="elevated">
          <RevenueTrends />
        </WaterDropCard>
        
        <WaterDropCard variant="elevated">
          <UserGrowth />
        </WaterDropCard>
        
        <WaterDropCard variant="elevated">
          <Receipts />
        </WaterDropCard>
        
        <WaterDropCard variant="elevated">
          <SubscriptionDistribution />
        </WaterDropCard>
      </div>
    </div>
  );
} 