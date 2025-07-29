'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MetricsCard } from '@/components/metrics-card';
import { RevenueChart } from '@/components/revenue-chart';
import { ConversionChart } from '@/components/conversion-chart';
import { ChannelChart } from '@/components/channel-chart';
import { DataTable } from '@/components/data-table';
import { RealTimeIndicator } from '@/components/real-time-indicator';
import { 
  getMetricsDataFromApi,
  getEthereumChartData,
  getCryptoTableData,
  getCryptoChannelData,
  generateTableData,
  generateChannelData,
  type MetricData,
  type ChartDataPoint,
  type TableData,
  type ChannelData
} from '@/lib/mock-data';

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);

  useEffect(() => {
    // Initial data load with live data
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [metrics, charts, table, channels] = await Promise.all([
          getMetricsDataFromApi(),
          getEthereumChartData(),
          getCryptoTableData(),
          getCryptoChannelData()
        ]);
        setMetricsData(metrics);
        setChartData(charts);
        setTableData(table);
        setChannelData(channels);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Fallback to static data on error
        setTableData(generateTableData());
        setChannelData(generateChannelData());
      } finally {
        setIsLoading(false);
        setLastUpdated(new Date());
      }
    };

    loadInitialData();

    // Real-time updates every 60 seconds
    const interval = setInterval(() => {
      const updateData = async () => {
        try {
          const [metrics, charts, table, channels] = await Promise.all([
            getMetricsDataFromApi(),
            getEthereumChartData(),
            getCryptoTableData(),
            getCryptoChannelData()
          ]);
          setMetricsData(metrics);
          setChartData(charts);
          setTableData(table);
          setChannelData(channels);
          setLastUpdated(new Date());
        } catch (error) {
          console.error('Failed to update data:', error);
        }
      };
      updateData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Crypto Analytics Dashboard</h2>
            <p className="text-muted-foreground mt-2">
              Track cryptocurrency market performance in real-time
            </p>
          </div>
          <RealTimeIndicator />
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => (
            <MetricsCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
              icon={metric.icon}
              index={index}
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
            {/* Placeholder for additional chart or widget */}
            <div className="h-full min-h-[400px] rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Additional Chart</p>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={tableData} />
      </main>
    </div>
  );
}