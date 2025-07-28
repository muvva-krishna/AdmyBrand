'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// The interface for the props (properties) that this component accepts.
// It matches the structure of the data we're creating from the API.
interface MetricsCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  index: number;
}

// A mapping object to dynamically select the correct icon component
// based on the 'icon' prop string received from the data.
const iconMap = {
  DollarSign,
  Users,
  Target,
  TrendingUp
};

export function MetricsCard({ title, value, change, trend, icon, index }: MetricsCardProps) {
  // Selects the icon component from the map, defaulting to TrendingUp if not found.
  const Icon = iconMap[icon as keyof typeof iconMap] || TrendingUp;
  
  // Determines if the trend is positive to apply correct styling and icon.
  const isPositive = trend === 'up';

  return (
    // Framer Motion component for a smooth animation on load.
    // The 'delay' is staggered based on the card's index.
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              {/* Displays the title, e.g., "Total Market Cap (Top 5)" */}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              
              {/* Displays the main value, e.g., "$2.54b" */}
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              
              <div className="flex items-center gap-1">
                {/* Conditionally renders the TrendingUp or TrendingDown icon */}
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                
                {/* Displays the percentage change with dynamic coloring */}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {/* Adds a '+' sign if the change is positive */}
                  {isPositive ? '+' : ''}{change.toFixed(2)}%
                </span>
                
                {/* The text here is static, but the data it relates to is now dynamic */}
                <span className="text-sm text-muted-foreground">in 24h</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              {/* Renders the dynamic icon component */}
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
