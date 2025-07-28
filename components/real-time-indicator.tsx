'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export function RealTimeIndicator() {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Badge variant="outline" className="gap-2 animate-pulse">
      <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-green-300'} transition-colors`} />
      <Activity className="h-3 w-3" />
      Live Data
    </Badge>
  );
}