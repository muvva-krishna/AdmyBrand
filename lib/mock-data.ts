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
    const response = await fetch('https://api.coincap.io/v2/assets?limit=10');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const { data } = await response.json();

    const metrics = [
      {
        title: 'Bitcoin Price',
        value: `$${parseFloat(data[0].priceUsd).toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`,
        change: parseFloat(parseFloat(data[0].changePercent24Hr).toFixed(2)),
        trend: parseFloat(data[0].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'DollarSign'
      },
      {
        title: 'ETH Volume (24h)',
        value: `$${(parseFloat(data[1].volumeUsd24Hr) / 1000000000).toFixed(2)}B`,
        change: parseFloat(parseFloat(data[1].changePercent24Hr).toFixed(2)),
        trend: parseFloat(data[1].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'Users'
      },
      {
        title: 'Market Cap',
        value: `$${(parseFloat(data[0].marketCapUsd) / 1000000000).toFixed(1)}B`,
        change: parseFloat(parseFloat(data[0].changePercent24Hr).toFixed(2)),
        trend: parseFloat(data[0].changePercent24Hr) >= 0 ? 'up' : 'down',
        icon: 'Target'
      },
      {
        title: 'Top Performer',
        value: data.reduce((best: any, current: any) => 
          parseFloat(current.changePercent24Hr) > parseFloat(best.changePercent24Hr) ? current : best
        ).name,
        change: parseFloat(parseFloat(data.reduce((best: any, current: any) => 
          parseFloat(current.changePercent24Hr) > parseFloat(best.changePercent24Hr) ? current : best
        ).changePercent24Hr).toFixed(2)),
        trend: 'up',
        icon: 'TrendingUp'
      }
    ];

    return metrics;
  } catch (error) {
    console.error("Failed to fetch metrics data:", error);
    throw error; // Re-throw to handle in component
  }
};

/**
 * Fetches Ethereum price history and formats it for charts
 */
export const getEthereumChartData = async (): Promise<ChartDataPoint[]> => {
  try {
    // Get current timestamp and 30 days ago
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const response = await fetch(
      `https://api.coincap.io/v2/assets/ethereum/history?interval=d1&start=${thirtyDaysAgo}&end=${now}`
    );
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const { data } = await response.json();
    
    return data.map((point: any) => {
      const date = new Date(point.time);
      const price = parseFloat(point.priceUsd);
      const volume = price * (Math.random() * 1000000 + 500000); // Simulate volume based on price
      
      return {
        date: format(date, 'MMM dd'),
        price: Math.round(price),
        users: Math.round(800 + Math.random() * 400), // Keep for compatibility
        volume: Math.round(volume),
        impressions: Math.round(price * 10),
        clicks: Math.round(price * 0.1)
      };
    });
  } catch (error) {
    console.error("Failed to fetch Ethereum data:", error);
    throw error; // Re-throw to handle in component
  }
};

/**
 * Fetches live cryptocurrency data for table
 */
export const getCryptoTableData = async (): Promise<TableData[]> => {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=15');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const { data } = await response.json();

    const statuses: ('active' | 'paused' | 'completed')[] = ['active', 'paused', 'completed'];
    
    return data.map((crypto: any, index: number) => ({
      id: crypto.id,
      campaign: `${crypto.name} Trading`,
      channel: ['Binance', 'Coinbase', 'Kraken', 'Gemini', 'KuCoin'][index % 5],
      revenue: Math.round(parseFloat(crypto.volumeUsd24Hr) / 1000000), // Volume in millions
      conversions: Math.round(parseFloat(crypto.marketCapUsd) / parseFloat(crypto.priceUsd) / 1000000), // Supply in millions
      ctr: parseFloat(parseFloat(crypto.changePercent24Hr).toFixed(2)),
      status: statuses[index % 3],
      date: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'MMM dd, yyyy')
    }));
  } catch (error) {
    console.error("Failed to fetch crypto table data:", error);
    throw error;
  }
};

/**
 * Fetches live data for channel distribution
 */
export const getCryptoChannelData = async (): Promise<ChannelData[]> => {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=5');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const { data } = await response.json();

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
    
    // Calculate total market cap for percentage calculation
    const totalMarketCap = data.reduce((sum: number, crypto: any) => 
      sum + parseFloat(crypto.marketCapUsd), 0
    );

    return data.map((crypto: any, index: number) => ({
      name: crypto.name,
      value: parseFloat(((parseFloat(crypto.marketCapUsd) / totalMarketCap) * 100).toFixed(1)),
      color: colors[index]
    }));
  } catch (error) {
    console.error("Failed to fetch channel data:", error);
    throw error;
  }
};

// --- FALLBACK STATIC DATA FUNCTIONS ---

// Generate mock metrics data (fallback only)
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

// Generate mock chart data for the last 30 days (fallback only)
export const generateChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const basePrice = 2000 + Math.random() * 1000;
    const baseUsers = 800 + Math.random() * 400;
    
    data.push({
      date: format(date, 'MMM dd'),
      price: Math.round(basePrice),
      users: Math.round(baseUsers),
      volume: Math.round(basePrice * (Math.random() * 1000000 + 500000)),
      impressions: Math.round(baseUsers * (8 + Math.random() * 4)),
      clicks: Math.round(baseUsers * (0.8 + Math.random() * 0.4))
    });
  }
  
  return data;
};

// Generate mock table data (fallback only)
export const generateTableData = (): TableData[] => {
  const campaigns = [
    'Bitcoin Trading', 'Ethereum Mining', 'DeFi Staking', 'NFT Marketplace',
    'Altcoin Portfolio', 'Crypto Exchange', 'Blockchain Analytics', 'Token Launch',
    'Smart Contracts', 'Yield Farming', 'Liquidity Pool', 'Cross-chain Bridge'
  ];
  
  const channels = ['Binance', 'Coinbase', 'Kraken', 'Gemini', 'KuCoin', 'Huobi', 'FTX', 'Bitfinex'];
  const statuses: ('active' | 'paused' | 'completed')[] = ['active', 'paused', 'completed'];
  
  return campaigns.map((campaign, index) => ({
    id: `crypto-${index + 1}`,
    campaign,
    channel: channels[Math.floor(Math.random() * channels.length)],
    revenue: Math.round(100 + Math.random() * 900),
    conversions: Math.round(10 + Math.random() * 90),
    ctr: parseFloat((Math.random() * 10 - 5).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'MMM dd, yyyy')
  }));
};

// Generate channel distribution data (fallback only)
export const generateChannelData = (): ChannelData[] => [
  { name: 'Bitcoin', value: 45, color: '#3B82F6' },
  { name: 'Ethereum', value: 25, color: '#10B981' },
  { name: 'Binance Coin', value: 15, color: '#F59E0B' },
  { name: 'Cardano', value: 10, color: '#8B5CF6' },
  { name: 'Others', value: 5, color: '#6B7280' }
];