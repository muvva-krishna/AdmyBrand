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
  generateMetricsData, 
  generateChartData, 
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
    // Initial data load
    setMetricsData(generateMetricsData());
    setChartData(generateChartData());
    setTableData(generateTableData());
    setChannelData(generateChannelData());

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setMetricsData(generateMetricsData());
      setChartData(generateChartData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground mt-2">
              Track your digital marketing performance in real-time
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