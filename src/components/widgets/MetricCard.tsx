/**
 * Metric card component showing KPI with trend and sparkline
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SparkLine } from '@/components/charts/SparkLine';
import { formatNumber, formatCurrency, formatPercentage, calculatePercentageChange } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MetricDataPoint } from '@/types';

interface MetricCardProps {
  label: string;
  value: number;
  trend?: number;
  sparklineData?: MetricDataPoint[];
  unit?: 'number' | 'currency' | 'percentage' | 'time';
  comparison?: {
    value: number;
    period: string;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend = 0,
  sparklineData = [],
  unit = 'number',
  comparison,
  className = '',
}) => {
  const formatValue = () => {
    switch (unit) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
      default:
        return formatNumber(value);
    }
  };

  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-slate-400';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{label}</h3>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-slate-100 tracking-tight">
          {formatValue()}
        </p>

        {comparison && (
          <p className="text-xs text-slate-400 mt-2">
            {comparison.period}: {formatValue() === formatValue() ? '↑' : '↓'} {formatNumber(comparison.value)}
          </p>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="h-8 -mx-6 mb-2">
          <SparkLine
            data={sparklineData}
            height={32}
            width={276}
            trend={trend}
          />
        </div>
      )}
    </motion.div>
  );
};
