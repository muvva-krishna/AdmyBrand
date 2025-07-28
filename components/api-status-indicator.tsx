'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff } from 'lucide-react';

interface ApiStatusIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date;
}

export function ApiStatusIndicator({ isConnected, lastUpdate }: ApiStatusIndicatorProps) {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatLastUpdate = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="flex items-center gap-3">
      <Badge 
        variant={isConnected ? "default" : "destructive"} 
        className="gap-2 animate-pulse"
      >
        <div className={`h-2 w-2 rounded-full ${
          isConnected 
            ? (isLive ? 'bg-green-500' : 'bg-green-300') 
            : 'bg-red-500'
        } transition-colors`} />
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? 'Live APIs' : 'Offline'}
      </Badge>
      
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">
          Updated {formatLastUpdate(lastUpdate)}
        </span>
      )}
    </div>
  );
}