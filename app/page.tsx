'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { ApiMetricsCard } from '@/components/api-metrics-card';
import { RevenueChart } from '@/components/revenue-chart';
import { ConversionChart } from '@/components/conversion-chart';
import { ChannelChart } from '@/components/channel-chart';
import { ApiDataTable } from '@/components/api-data-table';
import { ApiStatusIndicator } from '@/components/api-status-indicator';
import { 
  fetchRevenueMetrics,
  fetchCampaignData,
  fetchChartData,
  fetchChannelData,
  type ApiMetrics,
  type ApiChartData,
  type ApiCampaignData,
  type ApiChannelData
} from '@/lib/api-service';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<ApiMetrics | null>(null);
  const [chartData, setChartData] = useState<ApiChartData[]>([]);
  const [tableData, setTableData] = useState<ApiCampaignData[]>([]);
  const [channelData, setChannelData] = useState<ApiChannelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [metrics, campaigns, charts, channels] = await Promise.all([
        fetchRevenueMetrics(),
        fetchCampaignData(),
        fetchChartData(),
        fetchChannelData()
      ]);
      
      setMetricsData(metrics);
      setTableData(campaigns);
      setChartData(charts);
      setChannelData(channels);
      setIsConnected(true);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Initial data load
    fetchAllData();

    // Real-time updates every 2 minutes
    const interval = setInterval(() => {
      fetchAllData();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const formatMetricValue = (value: number, type: string) => {
    switch (type) {
      case 'revenue':
        return `$${(value / 1000).toFixed(0)}B`;
      case 'users':
        return `${(value / 1000).toFixed(1)}M`;
      case 'conversions':
        return `${(value / 1000).toFixed(1)}K`;
      case 'growth':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  const getMetricsCards = () => {
    if (!metricsData) return [];
    
    return [
      {
        title: 'Total Revenue',
        value: formatMetricValue(metricsData.totalRevenue, 'revenue'),
        change: Math.round((metricsData.totalRevenue / 1000 - 800) / 8),
        trend: metricsData.totalRevenue > 800000 ? 'up' : 'down' as const,
        icon: 'DollarSign'
      },
      {
        title: 'Active Users',
        value: formatMetricValue(metricsData.activeUsers, 'users'),
        change: Math.round((metricsData.activeUsers / 1000 - 25) / 2.5),
        trend: metricsData.activeUsers > 25000 ? 'up' : 'down' as const,
        icon: 'Users'
      },
      {
        title: 'Total Conversions',
        value: formatMetricValue(metricsData.totalConversions, 'conversions'),
        change: Math.round((metricsData.totalConversions / 1000 - 18) / 1.8),
        trend: metricsData.totalConversions > 18000 ? 'up' : 'down' as const,
        icon: 'Target'
      },
      {
        title: 'Growth Rate',
        value: formatMetricValue(metricsData.growthRate, 'growth'),
        change: Math.round(metricsData.growthRate - 15),
        trend: metricsData.growthRate > 15 ? 'up' : 'down' as const,
        icon: 'TrendingUp'
      }
    ];
  };
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Real-Time Analytics Dashboard</h2>
            <p className="text-muted-foreground mt-2">
              Live data from multiple APIs - CoinGecko, JSONPlaceholder, and more
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchAllData} 
              variant="outline" 
              size="sm" 
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
            <ApiStatusIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {getMetricsCards().map((metric, index) => (
            <ApiMetricsCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
              icon={metric.icon}
              index={index}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart data={chartData} />
          </div>
          <div>
            <ChannelChart data={channelData} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <ConversionChart data={chartData} />
          <div className="lg:col-span-1">
            <div className="h-full min-h-[400px] rounded-lg border-2 border-dashed border-muted flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <p className="text-lg font-semibold text-muted-foreground">Geographic Analytics</p>
                <p className="text-sm text-muted-foreground">Weather-based campaign performance</p>
                <p className="text-xs text-muted-foreground">Feature coming soon...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <ApiDataTable 
          data={tableData} 
          isLoading={isLoading}
          onRefresh={fetchAllData}
        />
      </main>
    </div>
  );
}