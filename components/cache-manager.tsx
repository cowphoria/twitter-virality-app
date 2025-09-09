'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Trash2, RefreshCw, TrendingUp, Clock, HardDrive } from 'lucide-react';
import { cacheService } from '@/lib/cache-service';

interface CacheManagerProps {
  className?: string;
}

export function CacheManager({ className }: CacheManagerProps) {
  const [stats, setStats] = useState(cacheService.getStats());
  const [entries, setEntries] = useState(cacheService.getEntries());
  const [loading, setLoading] = useState(false);

  const refreshStats = () => {
    setStats(cacheService.getStats());
    setEntries(cacheService.getEntries());
  };

  useEffect(() => {
    refreshStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const clearCache = async () => {
    setLoading(true);
    try {
      cacheService.clear();
      refreshStats();
    } finally {
      setLoading(false);
    }
  };

  const clearExpired = async () => {
    setLoading(true);
    try {
      const cleared = cacheService.clearExpired();
      refreshStats();
      console.log(`Cleared ${cleared} expired entries`);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatAge = (age: number): string => {
    const minutes = Math.floor(age / 60000);
    const seconds = Math.floor((age % 60000) / 1000);
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getEntryType = (key: string): string => {
    if (key.includes('tweet-analysis')) return 'Tweet Analysis';
    if (key.includes('tweet-suggestions')) return 'Tweet Suggestions';
    if (key.includes('hashtag-suggestions')) return 'Hashtag Suggestions';
    if (key.includes('trending-topics')) return 'Trending Topics';
    return 'Unknown';
  };

  const getEntryTypeColor = (type: string): string => {
    const colors = {
      'Tweet Analysis': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Tweet Suggestions': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Hashtag Suggestions': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Trending Topics': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Unknown': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[type as keyof typeof colors] || colors.Unknown;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cache Manager
            </CardTitle>
            <CardDescription>
              Monitor and manage GPT-4o response caching
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearExpired}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Clear Expired
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCache}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cache Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalHits}</div>
            <div className="text-sm text-muted-foreground">Cache Hits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.totalMisses}</div>
            <div className="text-sm text-muted-foreground">Cache Misses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.hitRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Hit Rate</div>
          </div>
        </div>

        {/* Hit Rate Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Cache Hit Rate</span>
            <span className="text-sm text-muted-foreground">{stats.hitRate.toFixed(1)}%</span>
          </div>
          <Progress value={stats.hitRate} className="h-2" />
        </div>

        {/* Memory Usage */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <HardDrive className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">Memory Usage</div>
            <div className="text-xs text-muted-foreground">
              {formatBytes(stats.memoryUsage)} estimated
            </div>
          </div>
        </div>

        {/* Cache Entries */}
        {entries.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Cache Entries</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {entries.slice(0, 10).map((entry, index) => {
                const type = getEntryType(entry.key);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={getEntryTypeColor(type)}>
                        {type}
                      </Badge>
                      <div>
                        <div className="text-sm font-medium truncate max-w-48">
                          {entry.key.split('-').slice(1).join('-')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatAge(entry.age)} old • {entry.hits} hits
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(entry.size)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Benefits */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Performance Benefits
            </span>
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
            <div>• Reduced API costs by caching GPT-4o responses</div>
            <div>• Faster response times for repeated analyses</div>
            <div>• Automatic cleanup of expired entries</div>
            <div>• Smart cache invalidation based on content</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
