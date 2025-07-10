"use client";

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import WaterDropCard from './WaterDropCard';

const monthlyData = [
  { month: 'Jan', revenue: 4000, users: 2400, orders: 1800 },
  { month: 'Feb', revenue: 3000, users: 1398, orders: 2210 },
  { month: 'Mar', revenue: 2000, users: 9800, orders: 2290 },
  { month: 'Apr', revenue: 2780, users: 3908, orders: 2000 },
  { month: 'May', revenue: 1890, users: 4800, orders: 2181 },
  { month: 'Jun', revenue: 2390, users: 3800, orders: 2500 },
  { month: 'Jul', revenue: 3490, users: 4300, orders: 2100 },
];

const pieData = [
  { name: 'Premium', value: 400, color: '#3B82F6' },
  { name: 'Basic', value: 300, color: '#10B981' },
  { name: 'Enterprise', value: 200, color: '#F59E0B' },
  { name: 'Free', value: 100, color: '#EF4444' },
];

const statsData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    chartData: monthlyData.map(d => ({ name: d.month, value: d.revenue })),
    chartType: 'area'
  },
  {
    title: 'Active Subscribers',
    value: '2,350',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    chartData: monthlyData.map(d => ({ name: d.month, value: d.users })),
    chartType: 'line'
  },
  {
    title: 'Total Subscriptions',
    value: '3,124',
    change: '+12.8%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-purple-500 to-pink-600',
    chartData: monthlyData.map(d => ({ name: d.month, value: d.orders })),
    chartType: 'bar'
  },
  {
    title: 'Churn Rate',
    value: '2.4%',
    change: '-0.8%',
    trend: 'down',
    icon: Activity,
    color: 'from-orange-500 to-red-600',
    chartData: pieData,
    chartType: 'pie'
  }
];

export default function StatisticsCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const renderChart = (data: any[], type: string, color: string) => {
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color.split(' ')[1]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color.split(' ')[1]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color.split(' ')[1]} 
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color.split(' ')[1]} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data}>
              <Bar 
                dataKey="value" 
                fill={color.split(' ')[1]}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={25}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <WaterDropCard
          key={index}
          variant="elevated"
          className="group cursor-pointer transition-all duration-300"
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                {stat.value}
              </p>
              
                    {/* Chart */}
      <div className="h-12 flex items-end">
        {renderChart(stat.chartData, stat.chartType, stat.color)}
      </div>
            </div>

            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl transition-opacity duration-300 ${
              hoveredCard === index ? 'opacity-100' : 'opacity-0'
            }`} />
          </div>
        </WaterDropCard>
      ))}
    </div>
  );
} 