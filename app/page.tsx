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
  getChartDataFromApi,
  getTableDataFromApi,
  getChannelDataFromApi,
  type MetricData,
  type ChartDataPoint,
  type TableData,
  type ChannelData
} from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  // State variables to hold the data for the dashboard components
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch data when the component mounts and set up a refresh interval
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all data points concurrently for better performance
        const [metrics, chart, table, channel] = await Promise.all([
          getMetricsDataFromApi(),
          getChartDataFromApi(),
          getTableDataFromApi(),
          getChannelDataFromApi()
        ]);
        // Update the state with the new data
        setMetricsData(metrics);
        setChartData(chart);
        setTableData(table);
        setChannelData(channel);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // In a real application, you might set an error state here to show a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Set up an interval to refresh the data every 30 seconds
    const interval = setInterval(fetchAllData, 30000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Display a loading skeleton UI while the initial data is being fetched
  if (loading) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto px-6 py-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-72 mb-2" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-36 rounded-lg" />
                    <Skeleton className="h-36 rounded-lg" />
                    <Skeleton className="h-36 rounded-lg" />
                    <Skeleton className="h-36 rounded-lg" />
                </div>
                <div className="grid gap-6 md:grid-cols-1">
                    <Skeleton className="h-96 rounded-lg" />
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground mt-2">
              Real-time cryptocurrency market insights
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
