import { addDays, subDays, format } from 'date-fns';

// --- INTERFACES ---
export interface MetricData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  users: number;
  volume: number;
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


// --- LIVE CRYPTO DATA FUNCTIONS ---

/**
 * Fetches live cryptocurrency data and formats it for dashboard metrics
 */
export const getMetricsDataFromApi = async (): Promise<MetricData[]> => {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=4');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const { data } = await response.json();

    const metrics = [
      {
        title: 'Bitcoin Price',
        value: `$${parseFloat(data[0].priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: parseFloat(data[0].changePercent24Hr),
        trend: parseFloat(data[0].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'DollarSign'
      },
      {
        title: 'ETH Volume (24h)',
        value: `$${(parseFloat(data[1].volumeUsd24Hr) / 1000000).toFixed(1)}M`,
        change: parseFloat(data[1].changePercent24Hr),
        trend: parseFloat(data[1].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'Users'
      },
      {
        title: 'Market Cap',
        value: `$${(parseFloat(data[0].marketCapUsd) / 1000000000).toFixed(1)}B`,
        change: parseFloat(data[0].changePercent24Hr),
        trend: parseFloat(data[0].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'Target'
      },
      {
        title: 'Top Performer',
        value: data[2].name,
        change: parseFloat(data[2].changePercent24Hr),
        trend: parseFloat(data[2].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'TrendingUp'
      }
    ];

    return metrics;
  } catch (error) {
    console.error("Failed to fetch metrics data:", error);
    return generateMetricsData(); // Fallback to static data
  }
};

/**
 * Fetches Ethereum price history and formats it for charts
 */
export const getEthereumChartData = async (): Promise<ChartDataPoint[]> => {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets/ethereum/history?interval=d1&start=1640995200000&end=1672531200000');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const { data } = await response.json();
    
    // Take last 30 days and format for charts
    const last30Days = data.slice(-30);
    
    return last30Days.map((point: any, index: number) => {
      const date = new Date(point.time);
      const price = parseFloat(point.priceUsd);
      const volume = price * (50000 + Math.random() * 100000); // Simulate volume
      
      return {
        date: format(date, 'MMM dd'),
        price: Math.round(price),
        users: Math.round(800 + Math.random() * 400), // Keep for compatibility
        volume: Math.round(volume),
        impressions: Math.round(price * 10), // Simulate impressions
        clicks: Math.round(price * 0.1) // Simulate clicks
      };
    });
  } catch (error) {
    console.error("Failed to fetch Ethereum data:", error);
    return generateChartData(); // Fallback to static data
  }
};

// --- STATIC DATA FUNCTIONS (Fallback) ---

// Generate mock metrics data
export const generateMetricsData = (): MetricData[] => [
  {
    title: 'Bitcoin Price',
    value: '$43,250.00',
    change: 12.5,
    trend: 'up',
    icon: 'DollarSign'
  },
  {
    title: 'ETH Volume (24h)',
    value: '$2.4B',
    change: -2.4,
    trend: 'down',
    icon: 'Users'
  },
  {
    title: 'Market Cap',
    value: '$847.2B',
    change: 8.7,
    trend: 'up',
    icon: 'Target'
  },
  {
    title: 'Top Performer',
    value: 'Ethereum',
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
      price: Math.round(baseRevenue / 10), // Convert to price range
      users: Math.round(baseUsers),
      volume: Math.round(baseRevenue * 2), // Volume data
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
    revenue: Math.round(1000 + Math.random() * 5000), // Smaller amounts for crypto context
    conversions: Math.round(5 + Math.random() * 50), // Adjusted for crypto trades
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
