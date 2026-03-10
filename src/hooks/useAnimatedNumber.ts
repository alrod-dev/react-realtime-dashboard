/**
 * Hook for animating number changes
 */

import { useEffect, useRef, useState } from 'react';

interface UseAnimatedNumberOptions {
  duration?: number;
  decimals?: number;
  easing?: (t: number) => number;
}

export function useAnimatedNumber(
  targetValue: number,
  { duration = 600, decimals = 0, easing = easeOutCubic }: UseAnimatedNumberOptions = {}
) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const startValueRef = useRef(displayValue);
  const animationIdRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easing(progress);
      const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;

      setDisplayValue(parseFloat(currentValue.toFixed(decimals)));

      if (progress < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    startValueRef.current = displayValue;
    startTimeRef.current = undefined;
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [targetValue, duration, decimals, easing]);

  return displayValue;
}

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function linear(t: number): number {
  return t;
}
