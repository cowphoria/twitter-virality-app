'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, RefreshCw, Hash, Users } from 'lucide-react';
import { trendingService, TrendingTopic } from '@/lib/trending-service';

interface TrendingTopicsProps {
  onHashtagSelect?: (hashtag: string) => void;
  className?: string;
}

export function TrendingTopics({ onHashtagSelect, className }: TrendingTopicsProps) {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchTrendingTopics = async () => {
    try {
      setLoading(true);
      const data = await trendingService.getTrendingTopics();
      setTrendingTopics(data.topics.slice(0, 10)); // Show top 10
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      console.error('Failed to fetch trending topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const formatTweetVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      business: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      politics: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
          <CardDescription>Loading trending topics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
            <CardDescription>
              {lastUpdated && `Updated ${new Date(lastUpdated).toLocaleTimeString()}`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTrendingTopics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingTopics.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No trending topics available
            </div>
          ) : (
            trendingTopics.map((topic, index) => (
              <div
                key={topic.hashtag}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onHashtagSelect?.(topic.hashtag)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{topic.hashtag}</span>
                    <span className="text-2xl">{getSentimentIcon(topic.sentiment)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getCategoryColor(topic.category)}>
                    {topic.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {formatTweetVolume(topic.tweetVolume)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {trendingTopics.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Click on any hashtag to use it in your tweet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
