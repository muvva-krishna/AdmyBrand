'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateChannelData } from '@/lib/generate-channel-data';
import { generateChartData } from '@/lib/generate-chart-data';
import { generateMetricsData } from '@/lib/generate-metrics-data';
import { generateTableData } from '@/lib/generate-table-data';
import { Metrics } from '@/components/dashboard/metrics';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { TransactionsTable } from '@/components/dashboard/transactions-table';
import { ChannelChart } from '@/components/dashboard/channel-chart';
import { useEffect, useState } from 'react';
import { ChartDataPoint, ChannelData, Metric, Transaction } from '@/types';

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tableData, setTableData] = useState<Transaction[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metrics, chart, table, channels] = await Promise.all([
          generateMetricsData(),
          generateChartData(),
          generateTableData(),
          generateChannelData()
        ]);
        setMetricsData(metrics);
        setChartData(chart);
        setTableData(table);
        setChannelData(channels);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      generateMetricsData().then(setMetricsData).catch(console.error);
      generateChartData().then(setChartData).catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!chartData.length || !metricsData.length || !channelData.length) {
    return (
      <p className="text-center py-12 text-muted-foreground">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <Metrics data={metricsData} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Recent revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>By Channels</CardTitle>
            <CardDescription>Traffic by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelChart data={channelData} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Recent orders from your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}
