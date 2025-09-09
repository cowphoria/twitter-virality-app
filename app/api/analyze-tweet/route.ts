import { type NextRequest, NextResponse } from "next/server"
import { twitterAlgorithm } from "@/lib/twitter-algorithm-bridge"
import { openRouterService } from "@/lib/openrouter-service"

interface TweetAnalysis {
  text: string
  score: number
  factors: {
    engagement: number
    timing: number
    content: number
    hashtags: number
    mentions: number
  }
  suggestions: string[]
  algorithmVersion?: string
  processingTime?: number
  gpt4oAnalysis?: {
    viralityScore: number
    contentAnalysis: {
      emotionalImpact: number
      engagementPotential: number
      clarityScore: number
      trendingRelevance: number
    }
    detailedInsights: string[]
    improvementAreas: string[]
    improvedVersions?: Array<{
      text: string
      changes: string[]
      expectedScoreIncrease: number
      reasoning: string
    }>
  }
  enhancedSuggestions?: string[]
}

function analyzeEngagement(text: string): number {
  // Analyze potential engagement based on content characteristics
  let score = 50 // Base score

  // Question marks increase engagement
  if (text.includes("?")) score += 15

  // Exclamation points add energy
  const exclamations = (text.match(/!/g) || []).length
  score += Math.min(exclamations * 5, 15)

  // Call-to-action words
  const ctaWords = ["retweet", "share", "comment", "thoughts", "agree", "disagree"]
  const ctaCount = ctaWords.filter((word) => text.toLowerCase().includes(word)).length
  score += ctaCount * 10

  // Controversial/opinion words
  const opinionWords = ["unpopular", "controversial", "hot take", "opinion", "think", "believe"]
  const opinionCount = opinionWords.filter((word) => text.toLowerCase().includes(word)).length
  score += opinionCount * 8

  return Math.min(score, 100)
}

function analyzeTiming(): number {
  const now = new Date()
  const hour = now.getHours()

  // Peak hours: 9-10 AM, 12-1 PM, 5-6 PM, 7-9 PM
  const peakHours = [9, 10, 12, 13, 17, 18, 19, 20, 21]

  if (peakHours.includes(hour)) {
    return 85
  } else if (hour >= 8 && hour <= 22) {
    return 65
  } else {
    return 35
  }
}

function analyzeContent(text: string): number {
  let score = 50

  // Optimal length (100-280 characters)
  const length = text.length
  if (length >= 100 && length <= 200) {
    score += 20
  } else if (length >= 80 && length <= 280) {
    score += 10
  } else if (length < 50) {
    score -= 15
  }

  // Trending topics (simplified)
  const trendingWords = ["AI", "crypto", "NFT", "web3", "startup", "tech", "breaking"]
  const trendingCount = trendingWords.filter((word) => text.toLowerCase().includes(word.toLowerCase())).length
  score += trendingCount * 8

  // Emotional words
  const emotionalWords = ["amazing", "incredible", "shocking", "unbelievable", "mind-blowing"]
  const emotionalCount = emotionalWords.filter((word) => text.toLowerCase().includes(word.toLowerCase())).length
  score += emotionalCount * 6

  return Math.min(score, 100)
}

function analyzeHashtags(text: string): number {
  const hashtags = (text.match(/#\w+/g) || []).length

  if (hashtags === 0) return 30
  if (hashtags >= 1 && hashtags <= 3) return 85
  if (hashtags >= 4 && hashtags <= 5) return 65
  return 40 // Too many hashtags
}

function analyzeMentions(text: string): number {
  const mentions = (text.match(/@\w+/g) || []).length

  if (mentions === 0) return 60
  if (mentions >= 1 && mentions <= 2) return 80
  if (mentions >= 3 && mentions <= 4) return 60
  return 35 // Too many mentions
}

function generateSuggestions(text: string, factors: any): string[] {
  const suggestions: string[] = []

  if (factors.engagement < 60) {
    suggestions.push("Add a question to encourage replies")
    suggestions.push("Include call-to-action words like 'thoughts?' or 'agree?'")
  }

  if (factors.content < 60) {
    if (text.length < 80) {
      suggestions.push("Expand your tweet - longer tweets often perform better")
    }
    suggestions.push("Add trending keywords relevant to your topic")
    suggestions.push("Use emotional words to increase engagement")
  }

  if (factors.hashtags < 60) {
    const hashtagCount = (text.match(/#\w+/g) || []).length
    if (hashtagCount === 0) {
      suggestions.push("Add 1-3 relevant hashtags to increase discoverability")
    } else if (hashtagCount > 3) {
      suggestions.push("Reduce hashtags to 1-3 for better performance")
    }
  }

  if (factors.mentions < 70 && (text.match(/@\w+/g) || []).length > 2) {
    suggestions.push("Limit mentions to 1-2 for better reach")
  }

  if (factors.timing < 60) {
    suggestions.push("Consider posting during peak hours (9-10 AM, 12-1 PM, 5-6 PM, 7-9 PM)")
  }

  return suggestions
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Tweet text is required" }, { status: 400 })
    }

    // Initialize the Twitter algorithm bridge if not already done
    if (!twitterAlgorithm['isInitialized']) {
      await twitterAlgorithm.initialize()
    }

    // Use the actual Twitter algorithm for analysis
    const algorithmResult = await twitterAlgorithm.runFullAnalysis(text)
    
    // Convert algorithm result to the expected format
    const factors = {
      engagement: Math.round(algorithmResult.score.breakdown.socialSignals * 100),
      timing: Math.round(algorithmResult.score.breakdown.timing * 100),
      content: Math.round(algorithmResult.score.breakdown.contentQuality * 100),
      hashtags: Math.round(algorithmResult.score.features.hashtagCount * 20), // Convert to 0-100 scale
      mentions: Math.round(algorithmResult.score.features.mentionCount * 25), // Convert to 0-100 scale
    }

    // Convert algorithm suggestions to simple strings
    const suggestions = algorithmResult.suggestions.map(s => s.suggestion)

    // Try to enhance with GPT-4o analysis if available
    let gpt4oAnalysis = null
    let enhancedSuggestions: string[] = []
    
    if (openRouterService.isConfigured()) {
      try {
        console.log("Enhancing analysis with GPT-4o...")
        gpt4oAnalysis = await openRouterService.analyzeTweetContent(text)
        
        // Generate enhanced suggestions using GPT-4o
        const gpt4oSuggestions = await openRouterService.generateTweetSuggestions(text, gpt4oAnalysis)
        enhancedSuggestions = gpt4oSuggestions.improvedVersions.map(v => v.reasoning)
        
        // Add improved versions to the analysis
        gpt4oAnalysis.improvedVersions = gpt4oSuggestions.improvedVersions
        
        console.log("GPT-4o analysis completed successfully")
      } catch (gpt4oError) {
        console.warn("GPT-4o analysis failed, continuing with standard analysis:", gpt4oError)
        // Continue with standard analysis if GPT-4o fails
      }
    } else {
      console.log("GPT-4o not configured, using standard analysis")
    }

    const analysis: TweetAnalysis = {
      text,
      score: algorithmResult.score.viralityScore,
      factors,
      suggestions,
      algorithmVersion: algorithmResult.algorithmVersion,
      processingTime: algorithmResult.processingTime,
      gpt4oAnalysis,
      enhancedSuggestions: enhancedSuggestions.length > 0 ? enhancedSuggestions : undefined,
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing tweet:", error)
    
    // Fallback to original algorithm if Twitter algorithm fails
    try {
      const factors = {
        engagement: analyzeEngagement(text),
        timing: analyzeTiming(),
        content: analyzeContent(text),
        hashtags: analyzeHashtags(text),
        mentions: analyzeMentions(text),
      }

      const score = Math.round(
        factors.engagement * 0.3 +
          factors.timing * 0.2 +
          factors.content * 0.25 +
          factors.hashtags * 0.15 +
          factors.mentions * 0.1,
      )

      const suggestions = generateSuggestions(text, factors)

      // Try GPT-4o even in fallback mode if available
      let gpt4oAnalysis = null
      let enhancedSuggestions: string[] = []
      
      if (openRouterService.isConfigured()) {
        try {
          gpt4oAnalysis = await openRouterService.analyzeTweetContent(text)
          const gpt4oSuggestions = await openRouterService.generateTweetSuggestions(text, gpt4oAnalysis)
          enhancedSuggestions = gpt4oSuggestions.improvedVersions.map(v => v.reasoning)
          
          // Add improved versions to the analysis
          gpt4oAnalysis.improvedVersions = gpt4oSuggestions.improvedVersions
        } catch (gpt4oError) {
          console.warn("GPT-4o analysis failed in fallback mode:", gpt4oError)
        }
      }

      const analysis: TweetAnalysis = {
        text,
        score,
        factors,
        suggestions,
        algorithmVersion: "fallback-v1.0",
        gpt4oAnalysis,
        enhancedSuggestions: enhancedSuggestions.length > 0 ? enhancedSuggestions : undefined,
      }

      return NextResponse.json(analysis)
    } catch (fallbackError) {
      console.error("Fallback analysis also failed:", fallbackError)
      return NextResponse.json({ error: "Failed to analyze tweet" }, { status: 500 })
    }
  }
}
