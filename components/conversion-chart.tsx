'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { ChartDataPoint } from '@/lib/mock-data';

interface ConversionChartProps {
  data: ChartDataPoint[];
}

export function ConversionChart({ data }: ConversionChartProps) {
  if (!Array.isArray(data)) return null; // safeguard against undefined or non-array data

  const weekData = data.slice(-7); // Now guaranteed to be safe

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Weekly Conversions
          </CardTitle>
          <CardDescription>
            Conversion performance for the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), 'Conversions']}
                  labelClassName="text-sm font-medium"
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="conversions"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  className="transition-all duration-200 hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}