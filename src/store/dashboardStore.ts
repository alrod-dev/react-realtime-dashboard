/**
 * Zustand store for dashboard state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DashboardData, FilterState, LoadingState } from '@/types';

interface DashboardStore {
  // Data state
  data: DashboardData | null;
  setData: (data: DashboardData) => void;

  // Loading state
  loading: LoadingState;
  setLoading: (loading: Partial<LoadingState>) => void;

  // Filter state
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // WebSocket state
  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;

  // Theme state
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Selected metrics
  selectedMetrics: string[];
  toggleMetric: (metric: string) => void;
  setSelectedMetrics: (metrics: string[]) => void;

  // Date range
  dateRange: { from: Date; to: Date } | null;
  setDateRange: (from: Date, to: Date) => void;

  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Real-time status
  realtimeEnabled: boolean;
  setRealtimeEnabled: (enabled: boolean) => void;

  // Metrics visibility
  metricsVisibility: Record<string, boolean>;
  setMetricVisibility: (metric: string, visible: boolean) => void;
}

const defaultLoadingState: LoadingState = {
  isLoading: false,
  error: undefined,
  lastUpdate: undefined,
};

const defaultFilterState: FilterState = {
  searchQuery: '',
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set) => ({
        // Data state
        data: null,
        setData: (data) => set({ data }),

        // Loading state
        loading: defaultLoadingState,
        setLoading: (loading) =>
          set((state) => ({
            loading: { ...state.loading, ...loading, lastUpdate: Date.now() },
          })),

        // Filter state
        filters: defaultFilterState,
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),
        resetFilters: () => set({ filters: defaultFilterState }),

        // UI state
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),

        // WebSocket state
        wsConnected: false,
        setWsConnected: (connected) => set({ wsConnected: connected }),

        // Theme state
        theme: 'dark',
        setTheme: (theme) => set({ theme }),

        // Selected metrics
        selectedMetrics: ['pageViews', 'uniqueUsers', 'revenue', 'conversionRate'],
        toggleMetric: (metric) =>
          set((state) => {
            const isSelected = state.selectedMetrics.includes(metric);
            return {
              selectedMetrics: isSelected
                ? state.selectedMetrics.filter((m) => m !== metric)
                : [...state.selectedMetrics, metric],
            };
          }),
        setSelectedMetrics: (metrics) => set({ selectedMetrics: metrics }),

        // Date range
        dateRange: null,
        setDateRange: (from, to) => set({ dateRange: { from, to } }),

        // Search query
        searchQuery: '',
        setSearchQuery: (query) => set({ searchQuery: query }),

        // Real-time status
        realtimeEnabled: true,
        setRealtimeEnabled: (enabled) => set({ realtimeEnabled: enabled }),

        // Metrics visibility
        metricsVisibility: {
          pageViews: true,
          uniqueUsers: true,
          revenue: true,
          conversionRate: true,
          bounceRate: true,
          avgSessionDuration: true,
        },
        setMetricVisibility: (metric, visible) =>
          set((state) => ({
            metricsVisibility: {
              ...state.metricsVisibility,
              [metric]: visible,
            },
          })),
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          selectedMetrics: state.selectedMetrics,
          metricsVisibility: state.metricsVisibility,
          realtimeEnabled: state.realtimeEnabled,
        }),
      }
    )
  )
);
