/**
 * Core TypeScript interfaces for the dashboard
 */

export interface MetricDataPoint {
  timestamp: number;
  value: number;
}

export interface ChartDataPoint {
  name?: string;
  date?: string;
  hour?: number;
  day?: string;
  value: number;
  [key: string]: any;
}

export interface MetricCard {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  sparkline?: number[];
  comparison?: {
    value: number;
    period: string;
  };
  icon?: string;
  color?: string;
}

export interface TopPage {
  id: string;
  name: string;
  views: number;
  trend: number;
}

export interface RevenueSource {
  source: string;
  revenue: number;
  percentage: number;
}

export interface CountryData {
  country: string;
  users: number;
  revenue: number;
}

export interface HeatmapCell {
  hour: number;
  day: string;
  value: number;
}

export interface Activity {
  id: string;
  type: 'purchase' | 'signup' | 'page_view' | 'conversion';
  user: string;
  value?: number;
  timestamp: number;
}

export interface DashboardData {
  pageViews: MetricDataPoint[];
  uniqueUsers: MetricDataPoint[];
  revenue: MetricDataPoint[];
  conversionRate: MetricDataPoint[];
  bounceRate: MetricDataPoint[];
  avgSessionDuration: MetricDataPoint[];
  topPages: TopPage[];
  userGrowth: ChartDataPoint[];
  revenueBreakdown: RevenueSource[];
  worldMapData: CountryData[];
  heatmapData: HeatmapCell[];
  recentActivity: Activity[];
}

export interface WebSocketMessage {
  type: 'initial' | 'update' | 'error' | 'subscribed' | 'unsubscribed' | 'pong';
  data?: DashboardData;
  message?: string;
  timestamp: number;
  clientCount?: number;
  channel?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterState {
  dateRange?: DateRange;
  selectedMetrics?: string[];
  searchQuery?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdate?: number;
}

export interface TooltipPayload {
  dataKey: string;
  value: number;
  payload: any;
}
