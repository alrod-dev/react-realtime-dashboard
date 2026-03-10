/**
 * Hook for responsive media queries
 */

import { useEffect, useState, useCallback } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const mediaQuery = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, isMounted]);

  return isMounted && matches;
}

export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const width = BREAKPOINTS[breakpoint];
  return useMediaQuery(`(min-width: ${width}px)`);
}

export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}

export function useIsTablet(): boolean {
  const isSm = useBreakpoint('sm');
  const isMd = useBreakpoint('md');
  return isSm && !isMd;
}

export function useIsDesktop(): boolean {
  return useBreakpoint('lg');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function useDimensions(): { width: number; height: number } {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted]);

  return dimensions;
}
