/**
 * Bar chart component for categorical data
 */

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import { COLORS } from '@/lib/constants';
import type { ChartDataPoint } from '@/types';

interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  dataKey?: string;
  color?: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  title,
  dataKey = 'value',
  color = COLORS.chart.blue,
  height = 300,
  layout = 'horizontal',
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />

          <XAxis
            type={layout === 'vertical' ? 'number' : 'category'}
            dataKey={layout === 'vertical' ? undefined : 'name'}
            stroke={COLORS.textTertiary}
            style={{ fontSize: '12px' }}
            tick={{ fill: COLORS.textTertiary }}
            tickFormatter={layout === 'vertical' ? (value) => formatNumber(value) : undefined}
          />

          <YAxis
            type={layout === 'vertical' ? 'category' : 'number'}
            dataKey={layout === 'vertical' ? 'name' : undefined}
            stroke={COLORS.textTertiary}
            style={{ fontSize: '12px' }}
            tick={{ fill: COLORS.textTertiary }}
            tickFormatter={layout !== 'vertical' ? (value) => formatNumber(value) : undefined}
            width={layout === 'vertical' ? 100 : undefined}
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
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />

          <Bar
            dataKey={dataKey}
            fill={color}
            isAnimationActive={true}
            animationDuration={1000}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
