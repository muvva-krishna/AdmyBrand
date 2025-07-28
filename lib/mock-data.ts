import { addDays, subDays, format } from 'date-fns';

export interface MetricData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  users: number;
  conversions: number;
  impressions: number;
  clicks: number;
}

export interface TableData {
  id: string;
  campaign: string;
  channel: string;
  revenue: number;
  conversions: number;
  ctr: number;
  status: 'active' | 'paused' | 'completed';
  date: string;
}

export interface ChannelData {
  name: string;
  value: number;
  color: string;
}

// Generate mock metrics data
export const generateMetricsData = (): MetricData[] => [
  {
    title: 'Total Revenue',
    value: '$847,392',
    change: 12.5,
    trend: 'up',
    icon: 'DollarSign'
  },
  {
    title: 'Active Users',
    value: '24,847',
    change: -2.4,
    trend: 'down',
    icon: 'Users'
  },
  {
    title: 'Total Conversions',
    value: '18,394',
    change: 8.7,
    trend: 'up',
    icon: 'Target'
  },
  {
    title: 'Growth Rate',
    value: '15.2%',
    change: 3.1,
    trend: 'up',
    icon: 'TrendingUp'
  }
];

// Generate mock chart data for the last 30 days
export const generateChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const baseRevenue = 25000 + Math.random() * 10000;
    const baseUsers = 800 + Math.random() * 400;
    
    data.push({
      date: format(date, 'MMM dd'),
      revenue: Math.round(baseRevenue),
      users: Math.round(baseUsers),
      conversions: Math.round(baseUsers * (0.15 + Math.random() * 0.1)),
      impressions: Math.round(baseUsers * (8 + Math.random() * 4)),
      clicks: Math.round(baseUsers * (0.8 + Math.random() * 0.4))
    });
  }
  
  return data;
};

// Generate mock table data
export const generateTableData = (): TableData[] => {
  const campaigns = [
    'Summer Sale 2024', 'Brand Awareness Q4', 'Product Launch', 'Holiday Special',
    'New Customer Acquisition', 'Retargeting Campaign', 'Email Marketing', 'Social Media Boost',
    'Mobile App Promotion', 'Video Ad Series', 'Influencer Collaboration', 'SEO Content Drive'
  ];
  
  const channels = ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Email', 'Organic'];
  const statuses: ('active' | 'paused' | 'completed')[] = ['active', 'paused', 'completed'];
  
  return campaigns.map((campaign, index) => ({
    id: `camp-${index + 1}`,
    campaign,
    channel: channels[Math.floor(Math.random() * channels.length)],
    revenue: Math.round(10000 + Math.random() * 50000),
    conversions: Math.round(50 + Math.random() * 500),
    ctr: parseFloat((1 + Math.random() * 4).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'MMM dd, yyyy')
  }));
};

// Generate channel distribution data
export const generateChannelData = (): ChannelData[] => [
  { name: 'Google Ads', value: 35, color: '#3B82F6' },
  { name: 'Facebook', value: 25, color: '#10B981' },
  { name: 'Instagram', value: 20, color: '#F59E0B' },
  { name: 'LinkedIn', value: 12, color: '#8B5CF6' },
  { name: 'Other', value: 8, color: '#6B7280' }
];