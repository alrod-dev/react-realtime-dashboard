/**
 * Pie/Donut chart component
 */

'use client';

import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { COLORS, CHART_PALETTE } from '@/lib/constants';
import type { ChartDataPoint } from '@/types';

interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  dataKey?: string;
  nameKey?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  title,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  colors = CHART_PALETTE,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>

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

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value, props) => {
              const payload = props.payload;
              return `${payload.name} (${formatNumber(payload.value)})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
