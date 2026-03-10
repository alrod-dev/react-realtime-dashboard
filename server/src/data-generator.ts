/**
 * Mock data generator for analytics dashboard
 * Simulates realistic patterns in page views, users, revenue, and conversions
 */

interface MetricDataPoint {
  timestamp: number;
  value: number;
}

interface DashboardData {
  pageViews: MetricDataPoint[];
  uniqueUsers: MetricDataPoint[];
  revenue: MetricDataPoint[];
  conversionRate: MetricDataPoint[];
  bounceRate: MetricDataPoint[];
  avgSessionDuration: MetricDataPoint[];
  topPages: Array<{
    id: string;
    name: string;
    views: number;
    trend: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
  revenueBreakdown: Array<{
    source: string;
    revenue: number;
    percentage: number;
  }>;
  worldMapData: Array<{
    country: string;
    users: number;
    revenue: number;
  }>;
  heatmapData: Array<{
    hour: number;
    day: string;
    value: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'purchase' | 'signup' | 'page_view' | 'conversion';
    user: string;
    value?: number;
    timestamp: number;
  }>;
}

class DataGenerator {
  private basePageViews: number = 1500;
  private baseUsers: number = 450;
  private baseRevenue: number = 2400;
  private baseConversion: number = 3.2;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize any data structures if needed
  }

  /**
   * Generate realistic time-series data with trends and noise
   */
  private generateTimeSeries(
    baseValue: number,
    points: number,
    volatility: number = 0.15,
    trend: number = 0.02
  ): MetricDataPoint[] {
    const data: MetricDataPoint[] = [];
    let currentValue = baseValue;
    const now = Date.now();

    for (let i = points - 1; i >= 0; i--) {
      // Add trend and random variation
      const randomVariation = (Math.random() - 0.5) * 2 * volatility * baseValue;
      const trendComponent = trend * baseValue * i;
      currentValue = baseValue + trendComponent + randomVariation;

      // Ensure non-negative values
      currentValue = Math.max(0, currentValue);

      data.push({
        timestamp: now - i * 60000, // 1 minute intervals
        value: Math.round(currentValue),
      });
    }

    return data;
  }

  /**
   * Generate realistic top pages with variations
   */
  private generateTopPages(): DashboardData['topPages'] {
    const pages = [
      { name: 'Dashboard', baseViews: 3400 },
      { name: 'Analytics', baseViews: 2810 },
      { name: 'Reports', baseViews: 2290 },
      { name: 'Settings', baseViews: 1890 },
      { name: 'Profile', baseViews: 1420 },
    ];

    return pages.map((page, index) => ({
      id: `page-${index}`,
      name: page.name,
      views: page.baseViews + Math.floor(Math.random() * 500),
      trend: (Math.random() - 0.5) * 40, // -20% to +20%
    }));
  }

  /**
   * Generate user growth data
   */
  private generateUserGrowth(): DashboardData['userGrowth'] {
    const data: DashboardData['userGrowth'] = [];
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const baseGrowth = 1000 + i * 50;
      const variation = Math.random() * 200 - 100;
      const users = Math.round(baseGrowth + variation);

      data.push({
        date: date.toISOString().split('T')[0],
        users: Math.max(100, users),
      });
    }

    return data;
  }

  /**
   * Generate revenue breakdown by source
   */
  private generateRevenueBreakdown(): DashboardData['revenueBreakdown'] {
    const sources = [
      { source: 'Direct', base: 8500 },
      { source: 'Organic Search', base: 6200 },
      { source: 'Social Media', base: 4300 },
      { source: 'Paid Ads', base: 5600 },
      { source: 'Email', base: 2100 },
    ];

    const total = sources.reduce((sum, s) => sum + s.base, 0);

    return sources.map((source) => ({
      source: source.source,
      revenue: source.base + Math.floor(Math.random() * 500),
      percentage: Math.round((source.base / total) * 100),
    }));
  }

  /**
   * Generate world map data
   */
  private generateWorldMapData(): DashboardData['worldMapData'] {
    const countries = [
      { country: 'United States', baseUsers: 850, baseRevenue: 12400 },
      { country: 'Canada', baseUsers: 320, baseRevenue: 4500 },
      { country: 'United Kingdom', baseUsers: 280, baseRevenue: 3800 },
      { country: 'Germany', baseUsers: 210, baseRevenue: 2900 },
      { country: 'France', baseUsers: 190, baseRevenue: 2600 },
      { country: 'Australia', baseUsers: 165, baseRevenue: 2200 },
      { country: 'Japan', baseUsers: 140, baseRevenue: 1900 },
      { country: 'Brazil', baseUsers: 120, baseRevenue: 1600 },
    ];

    return countries.map((c) => ({
      country: c.country,
      users: c.baseUsers + Math.floor(Math.random() * 200),
      revenue: c.baseRevenue + Math.floor(Math.random() * 1000),
    }));
  }

  /**
   * Generate hourly heatmap data
   */
  private generateHeatmapData(): DashboardData['heatmapData'] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: DashboardData['heatmapData'] = [];

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Higher activity during business hours and weekends
        let baseValue = 500;
        if (hour >= 9 && hour <= 17) baseValue = 1200;
        if (day >= 5) baseValue *= 0.8; // Lower on weekends

        const value = baseValue + Math.floor(Math.random() * 400 - 200);

        data.push({
          hour,
          day: days[day],
          value: Math.max(0, value),
        });
      }
    }

    return data;
  }

  /**
   * Generate recent activity events
   */
  private generateRecentActivity(): DashboardData['recentActivity'] {
    const activities: DashboardData['recentActivity'] = [];
    const now = Date.now();
    const types: Array<'purchase' | 'signup' | 'page_view' | 'conversion'> = [
      'purchase',
      'signup',
      'page_view',
      'conversion',
    ];
    const firstNames = [
      'Sarah',
      'John',
      'Emma',
      'Michael',
      'Lisa',
      'James',
      'Anna',
      'David',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
    ];

    for (let i = 0; i < 12; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      activities.push({
        id: `activity-${i}`,
        type,
        user: `${firstName} ${lastName}`,
        value: type === 'purchase' ? Math.round(Math.random() * 500 + 50) : undefined,
        timestamp: now - i * 30000, // 30 second intervals
      });
    }

    return activities;
  }

  /**
   * Generate complete dashboard data
   */
  generate(): DashboardData {
    return {
      pageViews: this.generateTimeSeries(this.basePageViews, 60, 0.12, 0.01),
      uniqueUsers: this.generateTimeSeries(this.baseUsers, 60, 0.1, 0.008),
      revenue: this.generateTimeSeries(this.baseRevenue, 60, 0.15, 0.015),
      conversionRate: this.generateTimeSeries(this.baseConversion, 60, 0.08),
      bounceRate: this.generateTimeSeries(42.5, 60, 0.1),
      avgSessionDuration: this.generateTimeSeries(245, 60, 0.12), // in seconds
      topPages: this.generateTopPages(),
      userGrowth: this.generateUserGrowth(),
      revenueBreakdown: this.generateRevenueBreakdown(),
      worldMapData: this.generateWorldMapData(),
      heatmapData: this.generateHeatmapData(),
      recentActivity: this.generateRecentActivity(),
    };
  }

  /**
   * Update only the real-time metrics with new data
   */
  updateRealtimeMetrics(currentData: DashboardData): void {
    const now = Date.now();

    // Update time series data
    const updateTimeSeries = (
      series: MetricDataPoint[],
      baseValue: number,
      volatility: number = 0.15
    ): void => {
      series.shift(); // Remove oldest data point
      const lastValue = series[series.length - 1].value;
      const randomVariation = (Math.random() - 0.5) * 2 * volatility * baseValue;
      const newValue = Math.max(0, lastValue * 0.85 + baseValue * 0.15 + randomVariation);

      series.push({
        timestamp: now,
        value: Math.round(newValue),
      });
    };

    updateTimeSeries(currentData.pageViews, this.basePageViews, 0.12);
    updateTimeSeries(currentData.uniqueUsers, this.baseUsers, 0.1);
    updateTimeSeries(currentData.revenue, this.baseRevenue, 0.15);
    updateTimeSeries(currentData.conversionRate, this.baseConversion, 0.08);
    updateTimeSeries(currentData.bounceRate, 42.5, 0.1);
    updateTimeSeries(currentData.avgSessionDuration, 245, 0.12);

    // Update top pages with slight variations
    currentData.topPages.forEach((page) => {
      page.views += Math.floor(Math.random() * 10 - 5);
      page.views = Math.max(0, page.views);
      page.trend += (Math.random() - 0.5) * 2;
    });

    // Add new activity
    const types: Array<'purchase' | 'signup' | 'page_view' | 'conversion'> = [
      'purchase',
      'signup',
      'page_view',
      'conversion',
    ];
    const firstNames = ['Sarah', 'John', 'Emma', 'Michael', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    currentData.recentActivity.pop(); // Remove oldest activity
    currentData.recentActivity.unshift({
      id: `activity-${Date.now()}`,
      type,
      user: `${firstName} ${lastName}`,
      value: type === 'purchase' ? Math.round(Math.random() * 500 + 50) : undefined,
      timestamp: now,
    });
  }
}

export const dataGenerator = new DataGenerator();
