/**
 * Revenue analytics page
 */

'use client';

import React from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { LineChartComponent } from '@/components/charts/LineChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { PieChartComponent } from '@/components/charts/PieChart';
import { Skeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { DateRangePicker } from '@/components/widgets/DateRangePicker';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

export default function RevenuePage() {
  const { data, loading } = useDashboardStore();

  if (loading.isLoading || !data) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonGrid columns={1} rows={3} />
      </div>
    );
  }

  const totalRevenue = data.revenue.reduce((sum, r) => sum + r.value, 0);
  const avgRevenue = totalRevenue / data.revenue.length;
  const maxRevenue = Math.max(...data.revenue.map((r) => r.value));

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Revenue</h1>
          <p className="text-sm text-slate-400 mt-1">Revenue metrics and financial insights</p>
        </div>
        <DateRangePicker />
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-sm font-medium text-slate-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-100">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-slate-400 mt-2">{data.revenue.length} periods</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-sm font-medium text-slate-400 mb-2">Average Revenue</p>
          <p className="text-3xl font-bold text-slate-100">{formatCurrency(avgRevenue)}</p>
          <p className="text-xs text-slate-400 mt-2">Per period</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-sm font-medium text-slate-400 mb-2">Peak Revenue</p>
          <p className="text-3xl font-bold text-slate-100">{formatCurrency(maxRevenue)}</p>
          <p className="text-xs text-slate-400 mt-2">Highest period</p>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
        <LineChartComponent
          data={data.revenue}
          title="Revenue Over Time"
          height={350}
          color="#22c55e"
          strokeWidth={3}
        />
      </div>

      {/* Revenue Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <PieChartComponent
            data={data.revenueBreakdown}
            title="Revenue by Source"
            dataKey="revenue"
            nameKey="source"
            height={350}
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Revenue Breakdown</h3>
          <div className="space-y-3">
            {data.revenueBreakdown.map((source, index) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">{source.source}</span>
                  <span className="text-sm font-bold text-slate-100">
                    {formatCurrency(source.revenue)}
                  </span>
                </div>
                <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      index === 0
                        ? 'bg-blue-500'
                        : index === 1
                        ? 'bg-purple-500'
                        : index === 2
                        ? 'bg-pink-500'
                        : 'bg-teal-500'
                    }`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">{formatPercentage(source.percentage)} of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Country */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-200">Revenue by Geography</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Country</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Users</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Per User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.worldMapData.map((country) => (
                <tr key={country.country} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-200">{country.country}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-200">
                    {formatNumber(country.users)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-200 font-semibold">
                    {formatCurrency(country.revenue)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-200">
                    {formatCurrency(country.revenue / country.users)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion and Revenue Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <LineChartComponent
            data={data.conversionRate}
            title="Conversion Rate Impact"
            height={300}
            color="#14b8a6"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
          <BarChartComponent
            data={data.topPages.map((p) => ({
              name: p.name,
              value: Math.round(p.views * 0.05), // Mock revenue contribution
            }))}
            title="Revenue by Top Pages"
            dataKey="value"
            color="#f97316"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
