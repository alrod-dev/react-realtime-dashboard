/**
 * Badge component for status indicators
 */

import React from 'react';
import { COLORS } from '@/lib/constants';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  default: `bg-slate-700 text-slate-100`,
  success: `bg-green-500/20 text-green-400`,
  warning: `bg-yellow-500/20 text-yellow-400`,
  error: `bg-red-500/20 text-red-400`,
  info: `bg-blue-500/20 text-blue-400`,
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
