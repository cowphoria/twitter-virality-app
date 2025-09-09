/**
 * Cache Service for GPT-4o responses and trending topics
 * Reduces API costs and improves response times
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hits: number;
  lastAccessed: number;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
  oldestEntry: number;
  newestEntry: number;
}

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private stats = {
    hits: 0,
    misses: 0
  };

  // Default TTL values (in milliseconds)
  private readonly DEFAULT_TTL = {
    GPT4O_ANALYSIS: 30 * 60 * 1000, // 30 minutes
    GPT4O_SUGGESTIONS: 15 * 60 * 1000, // 15 minutes
    TRENDING_TOPICS: 5 * 60 * 1000, // 5 minutes
    HASHTAG_SUGGESTIONS: 10 * 60 * 1000, // 10 minutes
  };

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.hits++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    
    return entry.data;
  }

  /**
   * Store data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL.GPT4O_ANALYSIS,
      hits: 0,
      lastAccessed: Date.now()
    };

    this.cache.set(key, entry);
  }

  /**
   * Generate cache key for tweet analysis
   */
  generateTweetAnalysisKey(tweetText: string): string {
    // Create a hash of the tweet text for consistent keys
    const hash = this.simpleHash(tweetText);
    return `tweet-analysis-${hash}`;
  }

  /**
   * Generate cache key for tweet suggestions
   */
  generateTweetSuggestionsKey(tweetText: string, analysisHash?: string): string {
    const hash = this.simpleHash(tweetText);
    const analysisPart = analysisHash ? `-${analysisHash}` : '';
    return `tweet-suggestions-${hash}${analysisPart}`;
  }

  /**
   * Generate cache key for hashtag suggestions
   */
  generateHashtagSuggestionsKey(tweetText: string): string {
    const hash = this.simpleHash(tweetText);
    return `hashtag-suggestions-${hash}`;
  }

  /**
   * Generate cache key for trending topics
   */
  generateTrendingTopicsKey(region: string = 'US'): string {
    return `trending-topics-${region}`;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Clear expired entries
   */
  clearExpired(): number {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalHits = this.stats.hits;
    const totalMisses = this.stats.misses;
    const totalRequests = totalHits + totalMisses;
    
    // Estimate memory usage (rough calculation)
    const memoryUsage = this.cache.size * 1024; // Rough estimate: 1KB per entry

    return {
      totalEntries: this.cache.size,
      totalHits,
      totalMisses,
      hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      memoryUsage,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0
    };
  }

  /**
   * Get cache entries with details
   */
  getEntries(): Array<{
    key: string;
    age: number;
    hits: number;
    ttl: number;
    size: number;
  }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      hits: entry.hits,
      ttl: entry.ttl,
      size: JSON.stringify(entry.data).length
    }));
  }

  /**
   * Simple hash function for generating consistent keys
   */
  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Cache with automatic TTL based on type
   */
  cacheWithTTL<T>(
    key: string, 
    data: T, 
    type: 'GPT4O_ANALYSIS' | 'GPT4O_SUGGESTIONS' | 'TRENDING_TOPICS' | 'HASHTAG_SUGGESTIONS'
  ): void {
    this.set(key, data, this.DEFAULT_TTL[type]);
  }

  /**
   * Get or set pattern for common use cases
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
    type?: 'GPT4O_ANALYSIS' | 'GPT4O_SUGGESTIONS' | 'TRENDING_TOPICS' | 'HASHTAG_SUGGESTIONS'
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch new data
    const data = await fetcher();
    
    // Cache the result
    if (type) {
      this.cacheWithTTL(key, data, type);
    } else {
      this.set(key, data, ttl);
    }

    return data;
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Auto-cleanup expired entries every 5 minutes
setInterval(() => {
  const cleared = cacheService.clearExpired();
  if (cleared > 0) {
    console.log(`Cache cleanup: removed ${cleared} expired entries`);
  }
}, 5 * 60 * 1000);
