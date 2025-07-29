import { addDays, subDays, format } from 'date-fns';

// --- INTERFACES (No changes needed here) ---
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


// --- NEW API-BASED FUNCTION FOR METRIC CARDS ---

/**
 * Fetches data for the top 4 cryptocurrencies from the CoinCap API 
 * and formats it for the Metric Cards.
 * * @returns {Promise<MetricData[]>} A promise that resolves to an array of metric data.
 */
export const getMetricsDataFromApi = async (): Promise<MetricData[]> => {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=4');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const { data } = await response.json();

    // Map API data to the MetricData interface
    const icons: string[] = ['DollarSign', 'Users', 'Target', 'TrendingUp'];
    return data.map((asset: any, index: number) => ({
      title: asset.name,
      value: `$${parseFloat(asset.priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: parseFloat(asset.changePercent24Hr),
      trend: parseFloat(asset.changePercent24Hr) >= 0 ? 'up' : 'down',
      icon: icons[index]
    }));
  } catch (error) {
    console.error("Failed to fetch metrics data:", error);
    return []; // Return an empty array on error
  }
};


// --- EXISTING STATIC DATA FUNCTIONS (Used for reference and fallback) ---

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
import { format } from 'date-fns';
import { subDays } from 'date-fns';

export interface ChartDataPoint {
  date: string;
  revenue: number; // replaced with coin price
  users: number;
  conversions: number;
  impressions: number;
  clicks: number;
}

const options = {
  headers: {
    'x-access-token': 'your-api-key', // Replace with your actual API key
  },
};

export const generateChartData = async (): Promise<ChartDataPoint[]> => {
  const response = await fetch(
    'https://api.coinranking.com/v2/coin/Qwsogvtv82FCd/price-history?timePeriod=30d',
    options
  );

  const result = await response.json();

  if (!result.data?.history || !Array.isArray(result.data.history)) {
    throw new Error('Invalid API response');
  }

  // Get the last 30 data points (oldest to newest)
  const history = result.data.history.slice(-30).reverse();

  const today = new Date();

  const data: ChartDataPoint[] = history.map((entry, index) => {
    const date = subDays(today, 29 - index);
    const price = parseFloat(entry.price);

    const baseUsers = 800 + Math.random() * 400;

    return {
      date: format(date, 'MMM dd'),
      revenue: Math.round(price), // using live price here
      users: Math.round(baseUsers),
      conversions: Math.round(baseUsers * (0.15 + Math.random() * 0.1)),
      impressions: Math.round(baseUsers * (8 + Math.random() * 4)),
      clicks: Math.round(baseUsers * (0.8 + Math.random() * 0.4)),
    };
  });

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
