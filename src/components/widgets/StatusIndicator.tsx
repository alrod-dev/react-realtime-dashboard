/**
 * Live connection status indicator
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  isConnected: boolean;
  isConnecting?: boolean;
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isConnected,
  isConnecting = false,
  label = 'Server',
}) => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          opacity: isConnected ? [1, 0.5, 1] : [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className={`w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-xs font-medium text-slate-400">
        {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};
