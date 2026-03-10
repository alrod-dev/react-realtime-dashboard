/**
 * Line chart component for time series data
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import { COLORS } from '@/lib/constants';
import type { MetricDataPoint } from '@/types';

interface LineChartProps {
  data: MetricDataPoint[];
  title?: string;
  dataKey?: string;
  color?: string;
  height?: number;
  showLegend?: boolean;
  syncId?: string;
  strokeWidth?: number;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  title,
  dataKey = 'value',
  color = COLORS.chart.blue,
  height = 300,
  showLegend = false,
  syncId,
  strokeWidth = 2,
}) => {
  const chartData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          syncId={syncId}
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />

          <XAxis
            dataKey="time"
            stroke={COLORS.textTertiary}
            style={{ fontSize: '12px' }}
            tick={{ fill: COLORS.textTertiary }}
          />

          <YAxis
            stroke={COLORS.textTertiary}
            style={{ fontSize: '12px' }}
            tick={{ fill: COLORS.textTertiary }}
            tickFormatter={(value) => formatNumber(value)}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.backgroundSecondary,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              color: COLORS.text,
            }}
            labelStyle={{ color: COLORS.text }}
            formatter={(value) => [formatNumber(value as number), dataKey]}
          />

          {showLegend && <Legend stroke={COLORS.textTertiary} />}

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={strokeWidth}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
            fillOpacity={1}
            fill={`url(#gradient-${color})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
