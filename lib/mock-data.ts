import { subDays, format } from 'date-fns';

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

// --- HELPER FUNCTIONS ---
const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}b`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}m`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}k`;
  return num.toString();
};

const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
    }
    const json = await response.json();
    if (!json.data) {
        throw new Error(`API response missing 'data' property for url: ${url}`);
    }
    return json.data;
};

// --- API-BASED DATA FUNCTIONS ---

export const getMetricsDataFromApi = async (): Promise<MetricData[]> => {
  const data = await fetchData('https://api.coincap.io/v2/assets?limit=4');
  if (!Array.isArray(data) || data.length === 0) return [];

  const [btc, eth, usdt, bnb] = data;

  return [
    {
      title: btc.name,
      value: `$${parseFloat(btc.priceUsd).toFixed(2)}`,
      change: parseFloat(btc.changePercent24Hr),
      trend: parseFloat(btc.changePercent24Hr) >= 0 ? 'up' : 'down',
      icon: 'DollarSign'
    },
    {
      title: eth.name,
      value: `$${parseFloat(eth.priceUsd).toFixed(2)}`,
      change: parseFloat(eth.changePercent24Hr),
      trend: parseFloat(eth.changePercent24Hr) >= 0 ? 'up' : 'down',
      icon: 'Users'
    },
    {
      title: usdt.name,
      value: `$${parseFloat(usdt.priceUsd).toFixed(2)}`,
      change: parseFloat(usdt.changePercent24Hr),
      trend: parseFloat(usdt.changePercent24Hr) >= 0 ? 'up' : 'down',
      icon: 'Target'
    },
    {
      title: bnb.name,
      value: `$${parseFloat(bnb.priceUsd).toFixed(2)}`,
      change: parseFloat(bnb.changePercent24Hr),
      trend: parseFloat(bnb.changePercent24Hr) >= 0 ? 'up' : 'down',
      icon: 'TrendingUp'
    }
  ];
};

export const getChartDataFromApi = async (): Promise<ChartDataPoint[]> => {
    const data = await fetchData('https://api.coincap.io/v2/assets/bitcoin/history?interval=d1');
    if (!Array.isArray(data)) return [];

    return data.slice(-30).map((item: any) => ({
        date: format(new Date(item.time), 'MMM dd'),
        revenue: parseFloat(item.priceUsd),
        users: parseFloat(item.priceUsd) / 20 + Math.random() * 100,
        conversions: parseFloat(item.priceUsd) / 100 + Math.random() * 50,
        impressions: parseFloat(item.priceUsd) * 2 + Math.random() * 1000,
        clicks: parseFloat(item.priceUsd) / 5 + Math.random() * 200,
    }));
};

export const getTableDataFromApi = async (): Promise<TableData[]> => {
    const data = await fetchData('https://api.coincap.io/v2/assets?limit=12');
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
        id: item.id,
        campaign: item.name,
        channel: item.symbol,
        revenue: parseFloat(item.marketCapUsd),
        conversions: parseFloat(item.volumeUsd24Hr),
        ctr: parseFloat(item.changePercent24Hr),
        status: parseFloat(item.changePercent24Hr) >= 0 ? 'active' : 'paused',
        date: format(new Date(), 'MMM dd, yyyy')
    }));
};

export const getChannelDataFromApi = async (): Promise<ChannelData[]> => {
    const data = await fetchData('https://api.coincap.io/v2/assets?limit=5');
    if (!Array.isArray(data)) return [];
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];
    const totalMarketCap = data.reduce((acc, curr) => acc + parseFloat(curr.marketCapUsd), 0);

    return data.map((item: any, index: number) => ({
        name: item.symbol,
        value: parseFloat(((parseFloat(item.marketCapUsd) / totalMarketCap) * 100).toFixed(2)),
        color: colors[index]
    }));
};


// --- STATIC MOCK DATA (FALLBACK) ---

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

export const generateChannelData = (): ChannelData[] => [
  { name: 'Google Ads', value: 35, color: '#3B82F6' },
  { name: 'Facebook', value: 25, color: '#10B981' },
  { name: 'Instagram', value: 20, color: '#F59E0B' },
  { name: 'LinkedIn', value: 12, color: '#8B5CF6' },
  { name: 'Other', value: 8, color: '#6B7280' }
];
