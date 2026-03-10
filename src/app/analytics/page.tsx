/**
 * Detailed analytics page
 */

'use client';

import React from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { LineChartComponent } from '@/components/charts/LineChart';
import { HeatMap } from '@/components/charts/HeatMap';
import { Skeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { DateRangePicker } from '@/components/widgets/DateRangePicker';

export default function AnalyticsPage() {
  const { data, loading } = useDashboardStore();

  if (loading.isLoading || !data) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonGrid columns={1} rows={3} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Detailed performance metrics and insights</p>
        </div>
        <DateRangePicker />
      </div>

      {/* User Growth */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
        <AreaChartComponent
          data={data.userGrowth}
          title="User Growth Over Time"
          dataKey="users"
          height={350}
          color="#22c55e"
        />
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.conversionRate}
            title="Conversion Rate Trend"
            height={300}
            color="#14b8a6"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <AreaChartComponent
            data={data.pageViews.map((p, i) => ({
              name: new Date(p.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }),
              value: p.value,
            }))}
            title="Page Views Distribution"
            dataKey="value"
            height={300}
            color="#3b82f6"
          />
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
        <HeatMap
          data={data.heatmapData}
          title="Activity Heatmap by Hour and Day"
          height={250}
          colorScheme="blues"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.avgSessionDuration}
            title="Avg Session Duration"
            height={300}
            color="#f97316"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.bounceRate}
            title="Bounce Rate Trend"
            height={300}
            color="#ef4444"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.revenue}
            title="Revenue Trend"
            height={300}
            color="#22c55e"
          />
        </div>
      </div>
    </div>
  );
}
