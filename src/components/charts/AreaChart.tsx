/**
 * Area chart component for cumulative data
 */

'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import { COLORS } from '@/lib/constants';
import type { ChartDataPoint } from '@/types';

interface AreaChartProps {
  data: ChartDataPoint[];
  title?: string;
  dataKey?: string;
  color?: string;
  height?: number;
}

export const AreaChartComponent: React.FC<AreaChartProps> = ({
  data,
  title,
  dataKey = 'value',
  color = COLORS.chart.blue,
  height = 300,
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id={`areaGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />

          <XAxis
            dataKey="name"
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

          <Area
            type="monotone"
            dataKey={dataKey}
            fill={`url(#areaGradient-${color})`}
            stroke={color}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
