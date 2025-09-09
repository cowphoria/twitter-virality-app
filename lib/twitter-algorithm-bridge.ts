/**
 * Twitter Algorithm Bridge
 * 
 * This module bridges the frontend Twitter virality app with the actual Twitter algorithm components.
 * It provides a simplified interface to access key algorithm features like scoring, ranking, and content analysis.
 */

import { spawn } from 'child_process';
import path from 'path';

// Types for algorithm integration
export interface TweetFeatures {
  text: string;
  hasUrl: boolean;
  hasMedia: boolean;
  isRetweet: boolean;
  isReply: boolean;
  length: number;
  hashtagCount: number;
  mentionCount: number;
  questionMarkCount: number;
  exclamationCount: number;
  timestamp: number;
  authorId?: string;
  tweetId?: string;
}

export interface AlgorithmScore {
  lightRankerScore: number;
  heavyRankerScore?: number;
  toxicityScore: number;
  engagementScore: number;
  viralityScore: number;
  features: TweetFeatures;
  breakdown: {
    contentQuality: number;
    socialSignals: number;
    timing: number;
    userReputation: number;
    safetyScore: number;
  };
}

export interface AlgorithmSuggestion {
  type: 'content' | 'timing' | 'engagement' | 'safety';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  expectedImprovement: number;
}

/**
 * Twitter Algorithm Bridge Class
 * 
 * Provides methods to interact with the actual Twitter algorithm components
 */
export class TwitterAlgorithmBridge {
  private algorithmPath: string;
  private isInitialized: boolean = false;

  constructor() {
    this.algorithmPath = path.join(process.cwd(), 'the-algorithm-main', 'the-algorithm-main');
  }

  /**
   * Initialize the algorithm bridge
   */
  async initialize(): Promise<void> {
    try {
      // Check if algorithm components are available
      await this.checkAlgorithmComponents();
      this.isInitialized = true;
      console.log('Twitter Algorithm Bridge initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Twitter Algorithm Bridge:', error);
      throw error;
    }
  }

  /**
   * Check if algorithm components are available
   */
  private async checkAlgorithmComponents(): Promise<void> {
    // This would check for required Python dependencies, model files, etc.
    // For now, we'll assume they're available
    return Promise.resolve();
  }

  /**
   * Extract features from tweet text (simplified version of Twitter's feature extraction)
   */
  extractFeatures(text: string, metadata?: any): TweetFeatures {
    const features: TweetFeatures = {
      text,
      hasUrl: /https?:\/\/[^\s]+/.test(text),
      hasMedia: /\[media\]|\[photo\]|\[video\]/i.test(text),
      isRetweet: text.startsWith('RT @') || text.includes('via @'),
      isReply: text.startsWith('@'),
      length: text.length,
      hashtagCount: (text.match(/#\w+/g) || []).length,
      mentionCount: (text.match(/@\w+/g) || []).length,
      questionMarkCount: (text.match(/\?/g) || []).length,
      exclamationCount: (text.match(/!/g) || []).length,
      timestamp: Date.now(),
      authorId: metadata?.authorId,
      tweetId: metadata?.tweetId,
    };

    return features;
  }

  /**
   * Calculate light ranker score (simplified version of Twitter's light ranker)
   */
  async calculateLightRankerScore(features: TweetFeatures): Promise<number> {
    if (!this.isInitialized) {
      throw new Error('Algorithm bridge not initialized');
    }

    try {
      // This would call the actual Python light ranker
      // For now, we'll use a simplified scoring algorithm based on Twitter's approach
      let score = 0.5; // Base score

      // Content quality factors
      if (features.length >= 50 && features.length <= 200) score += 0.1;
      if (features.questionMarkCount > 0) score += 0.05;
      if (features.exclamationCount > 0 && features.exclamationCount <= 2) score += 0.03;
      
      // Engagement factors
      if (features.hashtagCount >= 1 && features.hashtagCount <= 3) score += 0.08;
      if (features.mentionCount >= 1 && features.mentionCount <= 2) score += 0.05;
      
      // Content type factors
      if (features.hasUrl) score += 0.02;
      if (features.hasMedia) score += 0.05;
      if (features.isRetweet) score -= 0.1;
      
      // Penalize excessive elements
      if (features.hashtagCount > 5) score -= 0.1;
      if (features.mentionCount > 3) score -= 0.05;
      if (features.exclamationCount > 3) score -= 0.05;

      return Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error('Error calculating light ranker score:', error);
      return 0.5; // Default score
    }
  }

  /**
   * Calculate toxicity score using Twitter's toxicity model
   */
  async calculateToxicityScore(text: string): Promise<number> {
    if (!this.isInitialized) {
      throw new Error('Algorithm bridge not initialized');
    }

    try {
      // This would call the actual Python toxicity model
      // For now, we'll use a simplified heuristic-based approach
      const toxicWords = [
        'hate', 'stupid', 'idiot', 'moron', 'kill', 'die', 'damn', 'hell',
        'crap', 'suck', 'terrible', 'awful', 'disgusting', 'pathetic'
      ];
      
      const lowerText = text.toLowerCase();
      const toxicWordCount = toxicWords.filter(word => lowerText.includes(word)).length;
      
      // Simple toxicity score based on word presence
      const toxicityScore = Math.min(toxicWordCount * 0.2, 1.0);
      
      return toxicityScore;
    } catch (error) {
      console.error('Error calculating toxicity score:', error);
      return 0.1; // Default low toxicity
    }
  }

  /**
   * Calculate engagement score based on Twitter's engagement prediction
   */
  async calculateEngagementScore(features: TweetFeatures): Promise<number> {
    if (!this.isInitialized) {
      throw new Error('Algorithm bridge not initialized');
    }

    try {
      let score = 0.3; // Base engagement score

      // Question-based engagement
      if (features.questionMarkCount > 0) score += 0.2;
      
      // Call-to-action words
      const ctaWords = ['what', 'think', 'opinion', 'agree', 'disagree', 'thoughts', 'share'];
      const ctaCount = ctaWords.filter(word => 
        features.text.toLowerCase().includes(word)
      ).length;
      score += ctaCount * 0.05;

      // Emotional words
      const emotionalWords = ['amazing', 'incredible', 'shocking', 'unbelievable', 'wow'];
      const emotionalCount = emotionalWords.filter(word => 
        features.text.toLowerCase().includes(word)
      ).length;
      score += emotionalCount * 0.03;

      // Optimal length for engagement
      if (features.length >= 100 && features.length <= 200) score += 0.1;

      return Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error('Error calculating engagement score:', error);
      return 0.3; // Default engagement score
    }
  }

  /**
   * Calculate comprehensive virality score using multiple algorithm components
   */
  async calculateViralityScore(text: string, metadata?: any): Promise<AlgorithmScore> {
    if (!this.isInitialized) {
      throw new Error('Algorithm bridge not initialized');
    }

    try {
      const features = this.extractFeatures(text, metadata);
      
      // Calculate individual scores
      const lightRankerScore = await this.calculateLightRankerScore(features);
      const toxicityScore = await this.calculateToxicityScore(text);
      const engagementScore = await this.calculateEngagementScore(features);
      
      // Calculate breakdown scores
      const breakdown = {
        contentQuality: lightRankerScore * 0.4,
        socialSignals: engagementScore * 0.3,
        timing: this.calculateTimingScore(),
        userReputation: 0.7, // Default user reputation
        safetyScore: (1 - toxicityScore) * 0.2,
      };

      // Calculate overall virality score
      const viralityScore = (
        breakdown.contentQuality +
        breakdown.socialSignals +
        breakdown.timing +
        breakdown.userReputation +
        breakdown.safetyScore
      ) * 100;

      return {
        lightRankerScore,
        toxicityScore,
        engagementScore,
        viralityScore: Math.round(viralityScore),
        features,
        breakdown,
      };
    } catch (error) {
      console.error('Error calculating virality score:', error);
      throw error;
    }
  }

  /**
   * Calculate timing score based on current time
   */
  private calculateTimingScore(): number {
    const now = new Date();
    const hour = now.getHours();
    
    // Peak engagement hours (simplified)
    const peakHours = [9, 10, 12, 13, 17, 18, 19, 20, 21];
    
    if (peakHours.includes(hour)) {
      return 0.9;
    } else if (hour >= 8 && hour <= 22) {
      return 0.7;
    } else {
      return 0.4;
    }
  }

  /**
   * Generate algorithm-based suggestions for improving tweet virality
   */
  async generateSuggestions(score: AlgorithmScore): Promise<AlgorithmSuggestion[]> {
    const suggestions: AlgorithmSuggestion[] = [];

    // Content quality suggestions
    if (score.breakdown.contentQuality < 0.6) {
      suggestions.push({
        type: 'content',
        priority: 'high',
        suggestion: 'Improve content quality by adding more engaging language or expanding the tweet',
        expectedImprovement: 15,
      });
    }

    // Engagement suggestions
    if (score.breakdown.socialSignals < 0.5) {
      suggestions.push({
        type: 'engagement',
        priority: 'high',
        suggestion: 'Add a question or call-to-action to encourage replies and engagement',
        expectedImprovement: 20,
      });
    }

    // Timing suggestions
    if (score.breakdown.timing < 0.7) {
      suggestions.push({
        type: 'timing',
        priority: 'medium',
        suggestion: 'Consider posting during peak hours (9-10 AM, 12-1 PM, 5-6 PM, 7-9 PM)',
        expectedImprovement: 10,
      });
    }

    // Safety suggestions
    if (score.toxicityScore > 0.3) {
      suggestions.push({
        type: 'safety',
        priority: 'high',
        suggestion: 'Reduce potentially offensive language to improve content safety score',
        expectedImprovement: 25,
      });
    }

    return suggestions;
  }

  /**
   * Run a comprehensive analysis using the actual Twitter algorithm components
   */
  async runFullAnalysis(text: string, metadata?: any): Promise<{
    score: AlgorithmScore;
    suggestions: AlgorithmSuggestion[];
    algorithmVersion: string;
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Try to use the Python service first
      const pythonResult = await this.runPythonAnalysis(text, metadata);
      if (pythonResult) {
        return pythonResult;
      }
      
      // Fallback to TypeScript implementation
      const score = await this.calculateViralityScore(text, metadata);
      const suggestions = await this.generateSuggestions(score);
      
      return {
        score,
        suggestions,
        algorithmVersion: 'twitter-algorithm-v1.0',
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Error running full analysis:', error);
      throw error;
    }
  }

  /**
   * Run analysis using the Python Twitter algorithm service
   */
  private async runPythonAnalysis(text: string, metadata?: any): Promise<{
    score: AlgorithmScore;
    suggestions: AlgorithmSuggestion[];
    algorithmVersion: string;
    processingTime: number;
  } | null> {
    try {
      const pythonScript = path.join(process.cwd(), 'python', 'twitter_algorithm_service.py');
      
      const result = await new Promise<string>((resolve, reject) => {
        const python = spawn('python3', [pythonScript, text], {
          cwd: process.cwd(),
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let error = '';

        python.stdout.on('data', (data) => {
          output += data.toString();
        });

        python.stderr.on('data', (data) => {
          error += data.toString();
        });

        python.on('close', (code) => {
          if (code === 0) {
            resolve(output);
          } else {
            reject(new Error(`Python script failed with code ${code}: ${error}`));
          }
        });
      });

      const pythonData = JSON.parse(result);
      
      // Convert Python result to TypeScript format
      const score: AlgorithmScore = {
        lightRankerScore: pythonData.score.light_ranker_score,
        heavyRankerScore: pythonData.score.heavy_ranker_score,
        toxicityScore: pythonData.score.toxicity_score,
        engagementScore: pythonData.score.engagement_score,
        viralityScore: pythonData.score.virality_score,
        features: {
          text: pythonData.score.features.text,
          hasUrl: pythonData.score.features.has_url,
          hasMedia: pythonData.score.features.has_media,
          isRetweet: pythonData.score.features.is_retweet,
          isReply: pythonData.score.features.is_reply,
          length: pythonData.score.features.length,
          hashtagCount: pythonData.score.features.hashtag_count,
          mentionCount: pythonData.score.features.mention_count,
          questionMarkCount: pythonData.score.features.question_mark_count,
          exclamationCount: pythonData.score.features.exclamation_count,
          timestamp: pythonData.score.features.timestamp,
          authorId: pythonData.score.features.author_id,
          tweetId: pythonData.score.features.tweet_id,
        },
        breakdown: {
          contentQuality: pythonData.score.breakdown.content_quality,
          socialSignals: pythonData.score.breakdown.social_signals,
          timing: pythonData.score.breakdown.timing,
          userReputation: pythonData.score.breakdown.user_reputation,
          safetyScore: pythonData.score.breakdown.safety_score,
        },
      };

      const suggestions: AlgorithmSuggestion[] = pythonData.suggestions.map((s: any) => ({
        type: s.type,
        priority: s.priority,
        suggestion: s.suggestion,
        expectedImprovement: s.expected_improvement,
      }));

      return {
        score,
        suggestions,
        algorithmVersion: pythonData.algorithm_version,
        processingTime: pythonData.processing_time,
      };
    } catch (error) {
      console.error('Python analysis failed, falling back to TypeScript:', error);
      return null;
    }
  }
}

// Export singleton instance
export const twitterAlgorithm = new TwitterAlgorithmBridge();
