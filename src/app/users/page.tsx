/**
 * User analytics page
 */

'use client';

import React from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { LineChartComponent } from '@/components/charts/LineChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { PieChartComponent } from '@/components/charts/PieChart';
import { Skeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { DateRangePicker } from '@/components/widgets/DateRangePicker';
import { formatNumber } from '@/lib/utils';

export default function UsersPage() {
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
          <h1 className="text-3xl font-bold text-slate-100">User Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">User behavior and demographics</p>
        </div>
        <DateRangePicker />
      </div>

      {/* Key User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-sm font-medium text-slate-400 mb-2">Total Users</p>
          <p className="text-3xl font-bold text-slate-100">
            {formatNumber(data.uniqueUsers[data.uniqueUsers.length - 1]?.value || 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-sm font-medium text-slate-400 mb-2">New Users</p>
          <p className="text-3xl font-bold text-slate-100">
            {formatNumber(Math.round(data.uniqueUsers[data.uniqueUsers.length - 1]?.value * 0.15 || 0))}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-sm font-medium text-slate-400 mb-2">Returning Users</p>
          <p className="text-3xl font-bold text-slate-100">
            {formatNumber(Math.round(data.uniqueUsers[data.uniqueUsers.length - 1]?.value * 0.85 || 0))}
          </p>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
        <BarChartComponent
          data={data.userGrowth}
          title="User Growth Trend"
          dataKey="users"
          height={350}
          color="#3b82f6"
        />
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <PieChartComponent
            data={data.worldMapData.map((c) => ({
              name: c.country,
              value: c.users,
            }))}
            title="Users by Country"
            dataKey="value"
            nameKey="name"
            height={350}
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <PieChartComponent
            data={data.worldMapData.map((c) => ({
              name: c.country,
              value: c.revenue,
            }))}
            title="Revenue by Country"
            dataKey="value"
            nameKey="name"
            height={350}
          />
        </div>
      </div>

      {/* Behavioral Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.avgSessionDuration}
            title="Session Duration Analysis"
            height={300}
            color="#8b5cf6"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.bounceRate}
            title="Bounce Rate by Time"
            height={300}
            color="#ef4444"
          />
        </div>
      </div>

      {/* Top Performing Pages for Users */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 text-slate-200">User Engagement by Page</h3>
        <div className="space-y-4">
          {data.topPages.map((page, index) => (
            <div key={page.id} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{page.name}</p>
                <p className="text-xs text-slate-400">{formatNumber(page.views)} views</p>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {Math.round((page.views / (data.topPages[0]?.views || 1)) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
