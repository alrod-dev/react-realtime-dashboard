/**
 * Skeleton loading component
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circle: 'h-10 w-10 rounded-full',
    rect: 'h-12 w-full rounded-md',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${className} bg-slate-700 animate-pulse`}
    />
  );
};

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 2,
  rows = 3,
  className = '',
}) => {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {Array.from({ length: columns * rows }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
};
