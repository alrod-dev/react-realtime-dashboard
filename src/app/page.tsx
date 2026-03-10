/**
 * Main dashboard page
 */

'use client';

import React, { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { MetricCard } from '@/components/widgets/MetricCard';
import { ActivityFeed } from '@/components/widgets/ActivityFeed';
import { TopPages } from '@/components/widgets/TopPages';
import { LineChartComponent } from '@/components/charts/LineChart';
import { PieChartComponent } from '@/components/charts/PieChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { Skeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { DateRangePicker } from '@/components/widgets/DateRangePicker';
import { formatNumber, calculateTrend } from '@/lib/utils';
import type { DashboardData } from '@/types';

export default function DashboardPage() {
  const {
    data,
    setData,
    setWsConnected,
    loading,
    setLoading,
  } = useDashboardStore();

  const { isConnected } = useWebSocket({
    onMessage: (newData: DashboardData) => {
      setData(newData);
      setLoading({ isLoading: false });
    },
    onConnect: () => {
      setWsConnected(true);
      setLoading({ isLoading: false });
    },
    onDisconnect: () => {
      setWsConnected(false);
    },
    onError: (error) => {
      setLoading({ error });
    },
  });

  useEffect(() => {
    setWsConnected(isConnected);
  }, [isConnected, setWsConnected]);

  // Animate main KPIs
  const animatedPageViews = useAnimatedNumber(data?.pageViews[data.pageViews.length - 1]?.value || 0);
  const animatedUsers = useAnimatedNumber(data?.uniqueUsers[data.uniqueUsers.length - 1]?.value || 0);
  const animatedRevenue = useAnimatedNumber(data?.revenue[data.revenue.length - 1]?.value || 0);
  const animatedConversion = useAnimatedNumber(data?.conversionRate[data.conversionRate.length - 1]?.value || 0);

  // Calculate trends
  const pageViewsTrend = data ? calculateTrend(
    data.pageViews.slice(-10).map(p => p.value),
    data.pageViews.slice(-20, -10).map(p => p.value)
  ) : 0;

  const usersTrend = data ? calculateTrend(
    data.uniqueUsers.slice(-10).map(p => p.value),
    data.uniqueUsers.slice(-20, -10).map(p => p.value)
  ) : 0;

  const revenueTrend = data ? calculateTrend(
    data.revenue.slice(-10).map(p => p.value),
    data.revenue.slice(-20, -10).map(p => p.value)
  ) : 0;

  const conversionTrend = data ? calculateTrend(
    data.conversionRate.slice(-10).map(p => p.value),
    data.conversionRate.slice(-20, -10).map(p => p.value)
  ) : 0;

  if (loading.isLoading || !data) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <Skeleton className="w-40 h-10" />
        </div>

        <SkeletonGrid columns={4} rows={1} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-80" />
          <Skeleton className="h-80" />
        </div>

        <SkeletonGrid columns={2} rows={1} className="grid-cols-1 md:grid-cols-2" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            {isConnected ? 'Real-time data streaming' : 'Offline mode'}
          </p>
        </div>
        <DateRangePicker />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Page Views"
          value={animatedPageViews}
          trend={pageViewsTrend}
          unit="number"
          sparklineData={data.pageViews.slice(-20)}
        />
        <MetricCard
          label="Unique Users"
          value={animatedUsers}
          trend={usersTrend}
          unit="number"
          sparklineData={data.uniqueUsers.slice(-20)}
        />
        <MetricCard
          label="Revenue"
          value={animatedRevenue}
          trend={revenueTrend}
          unit="currency"
          sparklineData={data.revenue.slice(-20)}
        />
        <MetricCard
          label="Conversion Rate"
          value={animatedConversion}
          trend={conversionTrend}
          unit="percentage"
          sparklineData={data.conversionRate.slice(-20)}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Views Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.pageViews}
            title="Page Views Over Time"
            height={350}
            color="#3b82f6"
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <PieChartComponent
            data={data.revenueBreakdown}
            title="Revenue by Source"
            dataKey="revenue"
            nameKey="source"
            height={350}
            innerRadius={50}
            outerRadius={85}
          />
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bounce Rate and Session Duration */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.bounceRate}
            title="Bounce Rate"
            height={300}
            color="#ef4444"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <BarChartComponent
            data={data.topPages.map((p, i) => ({
              name: p.name,
              views: p.views,
            }))}
            title="Top Pages by Views"
            dataKey="views"
            color="#8b5cf6"
            height={300}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopPages pages={data.topPages} maxItems={8} />
        </div>

        <ActivityFeed activities={data.recentActivity} maxItems={10} />
      </div>
    </div>
  );
}
