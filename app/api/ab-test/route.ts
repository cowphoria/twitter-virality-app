import { NextRequest, NextResponse } from 'next/server';
import { openRouterService } from '@/lib/openrouter-service';
import { cacheService } from '@/lib/cache-service';

interface ABTestRequest {
  originalTweet: string;
  numVariants?: number;
}

interface TweetVariant {
  id: string;
  text: string;
  score: number;
  factors: {
    engagement: number;
    timing: number;
    content: number;
    hashtags: number;
    mentions: number;
  };
  gpt4oAnalysis?: {
    viralityScore: number;
    contentAnalysis: {
      emotionalImpact: number;
      engagementPotential: number;
      clarityScore: number;
      trendingRelevance: number;
    };
    detailedInsights: string[];
    improvementAreas: string[];
  };
  characterCount: number;
  hashtagCount: number;
  mentionCount: number;
}

interface ABTestResponse {
  originalTweet: string;
  variants: TweetVariant[];
  bestVariant: TweetVariant;
  improvement: number;
  processingTime: number;
}

// Simple scoring algorithm (you can replace this with your existing algorithm)
function calculateTweetScore(text: string): number {
  let score = 0;
  
  // Base score
  score += 50;
  
  // Length optimization (optimal around 100-200 characters)
  const length = text.length;
  if (length >= 100 && length <= 200) {
    score += 50;
  } else if (length >= 80 && length <= 250) {
    score += 30;
  } else if (length >= 50 && length <= 280) {
    score += 10;
  }
  
  // Hashtag analysis
  const hashtags = (text.match(/#\w+/g) || []).length;
  if (hashtags >= 1 && hashtags <= 3) {
    score += 30;
  } else if (hashtags > 3) {
    score -= 20; // Too many hashtags
  }
  
  // Mention analysis
  const mentions = (text.match(/@\w+/g) || []).length;
  if (mentions >= 1 && mentions <= 2) {
    score += 20;
  } else if (mentions > 2) {
    score -= 10; // Too many mentions
  }
  
  // Engagement hooks
  if (text.includes('?')) score += 15; // Questions
  if (text.includes('!')) score += 10; // Excitement
  if (text.includes('you') || text.includes('your')) score += 10; // Personal
  if (text.includes('how') || text.includes('what') || text.includes('why')) score += 15; // Curiosity
  
  // Emotional words
  const emotionalWords = ['amazing', 'incredible', 'unbelievable', 'shocking', 'breaking', 'exclusive'];
  const hasEmotionalWords = emotionalWords.some(word => text.toLowerCase().includes(word));
  if (hasEmotionalWords) score += 20;
  
  // Trending topics (basic check)
  const trendingTopics = ['ai', 'tech', 'startup', 'innovation', 'future', 'digital'];
  const hasTrendingTopics = trendingTopics.some(topic => text.toLowerCase().includes(topic));
  if (hasTrendingTopics) score += 15;
  
  return Math.min(Math.max(score, 0), 500); // Clamp between 0 and 500
}

function calculateFactors(text: string) {
  const hashtags = (text.match(/#\w+/g) || []).length;
  const mentions = (text.match(/@\w+/g) || []).length;
  
  // Engagement factor
  let engagement = 50;
  if (text.includes('?')) engagement += 20;
  if (text.includes('!')) engagement += 15;
  if (text.includes('you') || text.includes('your')) engagement += 15;
  if (text.includes('how') || text.includes('what') || text.includes('why')) engagement += 20;
  
  // Content factor
  let content = 50;
  const length = text.length;
  if (length >= 100 && length <= 200) content += 30;
  else if (length >= 80 && length <= 250) content += 20;
  else if (length >= 50 && length <= 280) content += 10;
  
  // Hashtag factor
  let hashtagScore = 0;
  if (hashtags >= 1 && hashtags <= 3) hashtagScore = 80;
  else if (hashtags === 0) hashtagScore = 40;
  else hashtagScore = 20;
  
  // Mention factor
  let mentionScore = 0;
  if (mentions >= 1 && mentions <= 2) mentionScore = 70;
  else if (mentions === 0) mentionScore = 50;
  else mentionScore = 30;
  
  return {
    engagement: Math.min(engagement, 100),
    timing: 75, // Default timing score
    content: Math.min(content, 100),
    hashtags: hashtagScore,
    mentions: mentionScore
  };
}

function countElements(text: string) {
  return {
    characterCount: text.length,
    hashtagCount: (text.match(/#\w+/g) || []).length,
    mentionCount: (text.match(/@\w+/g) || []).length
  };
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { originalTweet, numVariants = 3 }: ABTestRequest = await request.json();

    if (!originalTweet || originalTweet.trim().length === 0) {
      return NextResponse.json(
        { error: 'Original tweet text is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `ab-test-${originalTweet.slice(0, 50).replace(/\s+/g, '-')}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      console.log('Cache hit for A/B test');
      return NextResponse.json(cached);
    }

    console.log('Cache miss for A/B test, generating variants');

    // Generate variants using GPT-4o
    let variants: TweetVariant[] = [];
    
    try {
      // Get GPT-4o analysis for the original tweet
      const gpt4oAnalysis = await openRouterService.analyzeTweetContent(originalTweet);
      
      // Generate suggestions
      const suggestions = await openRouterService.generateTweetSuggestions(originalTweet, gpt4oAnalysis);
      
      // Create original variant
      const originalVariant: TweetVariant = {
        id: 'original',
        text: originalTweet,
        score: calculateTweetScore(originalTweet),
        factors: calculateFactors(originalTweet),
        gpt4oAnalysis,
        ...countElements(originalTweet)
      };
      
      variants.push(originalVariant);
      
      // Create variants from GPT-4o suggestions
      const numSuggestions = Math.min(numVariants - 1, suggestions.improvedVersions.length);
      for (let i = 0; i < numSuggestions; i++) {
        const suggestion = suggestions.improvedVersions[i];
        
        // Get GPT-4o analysis for this variant
        let variantAnalysis;
        try {
          variantAnalysis = await openRouterService.analyzeTweetContent(suggestion.text);
        } catch (error) {
          console.warn('Failed to get GPT-4o analysis for variant:', error);
          variantAnalysis = gpt4oAnalysis; // Fallback to original analysis
        }
        
        const variant: TweetVariant = {
          id: `variant-${i + 1}`,
          text: suggestion.text,
          score: calculateTweetScore(suggestion.text),
          factors: calculateFactors(suggestion.text),
          gpt4oAnalysis: variantAnalysis,
          ...countElements(suggestion.text)
        };
        
        variants.push(variant);
      }
      
    } catch (error) {
      console.error('Error generating variants with GPT-4o:', error);
      
      // Fallback: create simple variants without GPT-4o
      const originalVariant: TweetVariant = {
        id: 'original',
        text: originalTweet,
        score: calculateTweetScore(originalTweet),
        factors: calculateFactors(originalTweet),
        ...countElements(originalTweet)
      };
      
      variants.push(originalVariant);
      
      // Create simple variants by modifying the original
      const simpleVariants = [
        originalTweet + ' #Tech',
        originalTweet + ' What do you think?',
        originalTweet.replace(/\.$/, '!'),
        originalTweet.replace(/^/, '🚀 '),
        originalTweet.replace(/^/, 'Breaking: ')
      ];
      
      for (let i = 0; i < Math.min(numVariants - 1, simpleVariants.length); i++) {
        const variantText = simpleVariants[i];
        const variant: TweetVariant = {
          id: `variant-${i + 1}`,
          text: variantText,
          score: calculateTweetScore(variantText),
          factors: calculateFactors(variantText),
          ...countElements(variantText)
        };
        
        variants.push(variant);
      }
    }
    
    // Find best variant
    const bestVariant = variants.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    // Calculate improvement
    const improvement = ((bestVariant.score - variants[0].score) / variants[0].score) * 100;
    
    const response: ABTestResponse = {
      originalTweet,
      variants,
      bestVariant,
      improvement,
      processingTime: Date.now() - startTime
    };
    
    // Cache the result
    cacheService.set(cacheKey, response, 10 * 60 * 1000); // 10 minutes
    console.log('Cached A/B test result');
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error in A/B test API:', error);
    return NextResponse.json(
      { error: 'Failed to generate A/B test variants' },
      { status: 500 }
    );
  }
}
