// lib/mock-data.ts

import { subDays, format } from 'date-fns';

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

// Helper function to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}b`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}m`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}k`;
  }
  return num.toString();
};


// --- New API-based functions ---

export const getMetricsDataFromApi = async (): Promise<MetricData[]> => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=5');
  const { data } = await response.json();

  const totalMarketCap = data.reduce((acc: number, curr: any) => acc + parseFloat(curr.marketCapUsd), 0);
  const totalVolume = data.reduce((acc: number, curr: any) => acc + parseFloat(curr.volumeUsd24Hr), 0);
  const avgChange = data.reduce((acc: number, curr: any) => acc + parseFloat(curr.changePercent24Hr), 0) / data.length;

  return [
    {
      title: 'Total Market Cap (Top 5)',
      value: `$${formatNumber(totalMarketCap)}`,
      change: 1.2, // Static for now
      trend: 'up',
      icon: 'DollarSign'
    },
    {
      title: '24h Volume (Top 5)',
      value: `$${formatNumber(totalVolume)}`,
      change: -3.1, // Static for now
      trend: 'down',
      icon: 'Users'
    },
    {
      title: 'Total Cryptocurrencies',
      value: '2,296', // From Coincap homepage
      change: 0.5, // Static for now
      trend: 'up',
      icon: 'Target'
    },
    {
      title: 'Avg. 24h Change (Top 5)',
      value: `${avgChange.toFixed(2)}%`,
      change: avgChange,
      trend: avgChange > 0 ? 'up' : 'down',
      icon: 'TrendingUp'
    }
  ];
};

export const getChartDataFromApi = async (): Promise<ChartDataPoint[]> => {
    const response = await fetch('https://api.coincap.io/v2/assets/bitcoin/history?interval=d1');
    const { data } = await response.json();

    return data.slice(-30).map((item: any) => ({
        date: format(new Date(item.time), 'MMM dd'),
        revenue: parseFloat(item.priceUsd),
        // Mapping other properties as price for demonstration
        users: parseFloat(item.priceUsd) / 20,
        conversions: parseFloat(item.priceUsd) / 100,
        impressions: parseFloat(item.priceUsd) * 2,
        clicks: parseFloat(item.priceUsd) / 5,
    }));
};

export const getTableDataFromApi = async (): Promise<TableData[]> => {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=12');
    const { data } = await response.json();

    return data.map((item: any) => ({
        id: item.id,
        campaign: item.name,
        channel: item.symbol,
        revenue: parseFloat(item.marketCapUsd),
        conversions: parseFloat(item.volumeUsd24Hr),
        ctr: parseFloat(item.changePercent24Hr),
        status: parseFloat(item.changePercent24Hr) > 0 ? 'active' : 'paused',
        date: format(new Date(), 'MMM dd, yyyy')
    }));
};

export const getChannelDataFromApi = async (): Promise<ChannelData[]> => {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=5');
    const { data } = await response.json();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

    return data.map((item: any, index: number) => ({
        name: item.name,
        value: parseFloat(item.marketCapUsd),
        color: colors[index]
    }));
};