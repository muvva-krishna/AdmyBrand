'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  index: number;
}

const iconMap = {
  DollarSign,
  Users,
  Target,
  TrendingUp
};

export function MetricsCard({ title, value, change, trend, icon, index }: MetricsCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || TrendingUp;
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {isPositive ? '+' : ''}{change}%
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}