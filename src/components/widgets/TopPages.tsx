/**
 * Top pages table component
 */

'use client';

import React from 'react';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { TopPage } from '@/types';

interface TopPagesProps {
  pages: TopPage[];
  title?: string;
  maxItems?: number;
}

export const TopPages: React.FC<TopPagesProps> = ({
  pages,
  title = 'Top Pages',
  maxItems = 5,
}) => {
  const displayPages = pages.slice(0, maxItems);
  const maxViews = Math.max(...displayPages.map((p) => p.views), 1);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>

      <div className="space-y-4">
        {displayPages.map((page) => {
          const progress = (page.views / maxViews) * 100;
          const isPositive = page.trend > 0;

          return (
            <div key={page.id} className="space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {page.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatNumber(page.views)} views
                  </p>
                </div>

                {/* Trend */}
                <div
                  className={`flex items-center gap-1 ml-4 text-xs font-medium ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{page.trend > 0 ? '+' : ''}{page.trend.toFixed(1)}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
