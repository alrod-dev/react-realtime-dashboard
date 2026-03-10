/**
 * Constants and configuration for the dashboard
 */

export const COLORS = {
  // Primary brand colors
  primary: '#3b82f6', // blue-500
  primaryLight: '#60a5fa', // blue-400
  primaryDark: '#1e40af', // blue-800

  // Chart colors
  chart: {
    blue: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    teal: '#14b8a6',
    cyan: '#06b6d4',
  },

  // Background colors
  background: '#0f172a', // slate-900
  backgroundSecondary: '#1e293b', // slate-800
  backgroundTertiary: '#334155', // slate-700

  // Text colors
  text: '#e2e8f0', // slate-200
  textSecondary: '#cbd5e1', // slate-300
  textTertiary: '#94a3b8', // slate-400

  // Border colors
  border: '#334155', // slate-700
  borderLight: '#475569', // slate-600

  // Status colors
  success: '#22c55e',
  warning: '#f97316',
  error: '#ef4444',
  info: '#3b82f6',

  // Semantic colors
  up: '#22c55e', // green
  down: '#ef4444', // red
  neutral: '#94a3b8', // gray
};

export const CHART_PALETTE = [
  COLORS.chart.blue,
  COLORS.chart.purple,
  COLORS.chart.pink,
  COLORS.chart.green,
  COLORS.chart.teal,
  COLORS.chart.cyan,
  COLORS.chart.orange,
  COLORS.chart.yellow,
];

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
};

export const DATE_FORMATS = {
  full: 'MMMM d, yyyy',
  short: 'MMM d',
  time: 'HH:mm:ss',
  datetime: 'MMM d, HH:mm',
  month: 'MMMM yyyy',
};

export const METRIC_UNITS = {
  views: 'views',
  users: 'users',
  revenue: '$',
  rate: '%',
  duration: 's',
  bounce: '%',
};

export const REGIONS = [
  { code: 'NA', name: 'North America' },
  { code: 'SA', name: 'South America' },
  { code: 'EU', name: 'Europe' },
  { code: 'AF', name: 'Africa' },
  { code: 'AS', name: 'Asia' },
  { code: 'OC', name: 'Oceania' },
];

export const ACTIVITY_ICONS = {
  purchase: '🛒',
  signup: '👤',
  page_view: '👁️',
  conversion: '✓',
};

export const ACTIVITY_COLORS = {
  purchase: COLORS.chart.green,
  signup: COLORS.chart.blue,
  page_view: COLORS.chart.purple,
  conversion: COLORS.chart.teal,
};

export const SIDEBAR_WIDTH = '16rem'; // 256px
export const HEADER_HEIGHT = '4rem'; // 64px

export const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  reconnectDelay: 3000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
};

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
};

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
