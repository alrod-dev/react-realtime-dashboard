/**
 * Real-time activity feed component
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_ICONS, ACTIVITY_COLORS } from '@/lib/constants';
import { formatCompactTime, formatCurrency } from '@/lib/utils';
import type { Activity } from '@/types';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  title?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 10,
  title = 'Recent Activity',
}) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>

      <div className="space-y-3">
        <AnimatePresence>
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${ACTIVITY_COLORS[activity.type]}20` }}
                >
                  {ACTIVITY_ICONS[activity.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {activity.user}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activity.type === 'purchase'
                      ? `Purchased for ${formatCurrency(activity.value || 0)}`
                      : activity.type === 'signup'
                      ? 'Signed up'
                      : activity.type === 'conversion'
                      ? 'Converted'
                      : 'Visited page'}
                  </p>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-xs text-slate-400 whitespace-nowrap">
                  {formatCompactTime(activity.timestamp)}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>No recent activity</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
