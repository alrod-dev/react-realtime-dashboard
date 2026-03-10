/**
 * Mini sparkline chart component
 */

'use client';

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { generateSparklineColor } from '@/lib/utils';
import type { MetricDataPoint } from '@/types';

interface SparkLineProps {
  data: MetricDataPoint[];
  height?: number;
  width?: number;
  trend?: number;
}

export const SparkLine: React.FC<SparkLineProps> = ({
  data,
  height = 40,
  width = 100,
  trend = 0,
}) => {
  const color = generateSparklineColor(trend);

  const chartData = data.map((point) => ({
    value: point.value,
  }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
