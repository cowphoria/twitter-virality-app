/**
 * Trending Topics Service
 * Fetches real-time trending topics and hashtags for enhanced tweet suggestions
 */

import { cacheService } from './cache-service';

export interface TrendingTopic {
  hashtag: string;
  tweetVolume: number;
  category: 'technology' | 'business' | 'entertainment' | 'sports' | 'politics' | 'general';
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface TrendingData {
  topics: TrendingTopic[];
  lastUpdated: string;
  region: string;
}

class TrendingService {
  private cache: Map<string, { data: TrendingData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get trending topics for a specific region
   */
  async getTrendingTopics(region: string = 'US'): Promise<TrendingData> {
    const cacheKey = cacheService.generateTrendingTopicsKey(region);
    
    // Use cache service for better performance
    return cacheService.getOrSet(
      cacheKey,
      async () => {
        try {
          // For now, we'll use mock data, but this can be replaced with real APIs
          const trendingData = await this.fetchMockTrendingData(region);
          return trendingData;
        } catch (error) {
          console.error('Error fetching trending topics:', error);
          // Return fallback data
          return this.getFallbackTrendingData(region);
        }
      },
      undefined,
      'TRENDING_TOPICS'
    );
  }

  /**
   * Get trending topics relevant to a specific topic or keyword
   */
  async getRelevantTrendingTopics(keyword: string, region: string = 'US'): Promise<TrendingTopic[]> {
    const allTrending = await this.getTrendingTopics(region);
    
    // Filter topics that are relevant to the keyword
    const relevantTopics = allTrending.topics.filter(topic => 
      topic.hashtag.toLowerCase().includes(keyword.toLowerCase()) ||
      this.isTopicRelevant(topic, keyword)
    );

    return relevantTopics;
  }

  /**
   * Get top trending hashtags for suggestions
   */
  async getTopTrendingHashtags(limit: number = 10, region: string = 'US'): Promise<string[]> {
    const trendingData = await this.getTrendingTopics(region);
    return trendingData.topics
      .sort((a, b) => b.tweetVolume - a.tweetVolume)
      .slice(0, limit)
      .map(topic => topic.hashtag);
  }

  /**
   * Mock trending data (replace with real API calls)
   */
  private async fetchMockTrendingData(region: string): Promise<TrendingData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const mockTopics: TrendingTopic[] = [
      { hashtag: '#AI', tweetVolume: 125000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#TechNews', tweetVolume: 89000, category: 'technology', sentiment: 'neutral' },
      { hashtag: '#Startup', tweetVolume: 67000, category: 'business', sentiment: 'positive' },
      { hashtag: '#Innovation', tweetVolume: 54000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#WebDev', tweetVolume: 43000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#MachineLearning', tweetVolume: 38000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#OpenSource', tweetVolume: 32000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#Coding', tweetVolume: 28000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#DataScience', tweetVolume: 25000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#TechTrends', tweetVolume: 22000, category: 'technology', sentiment: 'neutral' },
      { hashtag: '#DigitalTransformation', tweetVolume: 18000, category: 'business', sentiment: 'positive' },
      { hashtag: '#CloudComputing', tweetVolume: 16000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#Cybersecurity', tweetVolume: 14000, category: 'technology', sentiment: 'neutral' },
      { hashtag: '#Blockchain', tweetVolume: 12000, category: 'technology', sentiment: 'positive' },
      { hashtag: '#IoT', tweetVolume: 10000, category: 'technology', sentiment: 'positive' }
    ];

    return {
      topics: mockTopics,
      lastUpdated: new Date().toISOString(),
      region
    };
  }

  /**
   * Fallback trending data when API fails
   */
  private getFallbackTrendingData(region: string): TrendingData {
    return {
      topics: [
        { hashtag: '#Tech', tweetVolume: 50000, category: 'technology', sentiment: 'positive' },
        { hashtag: '#Innovation', tweetVolume: 30000, category: 'technology', sentiment: 'positive' },
        { hashtag: '#AI', tweetVolume: 25000, category: 'technology', sentiment: 'positive' }
      ],
      lastUpdated: new Date().toISOString(),
      region
    };
  }

  /**
   * Check if a topic is relevant to a keyword
   */
  private isTopicRelevant(topic: TrendingTopic, keyword: string): boolean {
    const keywordLower = keyword.toLowerCase();
    const topicLower = topic.hashtag.toLowerCase();
    
    // Simple relevance check - can be enhanced with more sophisticated logic
    const relevantKeywords = {
      'ai': ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'ml'],
      'tech': ['tech', 'technology', 'software', 'programming', 'coding', 'development'],
      'business': ['business', 'startup', 'entrepreneur', 'marketing', 'sales'],
      'web': ['web', 'website', 'development', 'frontend', 'backend', 'fullstack']
    };

    for (const [category, keywords] of Object.entries(relevantKeywords)) {
      if (keywords.some(kw => keywordLower.includes(kw) && topicLower.includes(kw))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const trendingService = new TrendingService();
