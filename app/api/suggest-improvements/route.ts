import { type NextRequest, NextResponse } from "next/server"
import { openRouterService } from "@/lib/openrouter-service"

interface ImprovementSuggestion {
  original: string
  improved: string
  changes: string[]
  expectedScoreIncrease: number
  gpt4oVersions?: Array<{
    text: string
    changes: string[]
    expectedScoreIncrease: number
    reasoning: string
  }>
  alternativeApproaches?: string[]
  hashtagSuggestions?: {
    trending: string[]
    niche: string[]
    engagement: string[]
  }
}

const POWER_WORDS = [
  "breaking",
  "exclusive",
  "revealed",
  "secret",
  "hidden",
  "shocking",
  "amazing",
  "incredible",
  "unbelievable",
  "mind-blowing",
  "game-changing",
]

const ENGAGEMENT_STARTERS = [
  "What do you think about",
  "Unpopular opinion:",
  "Hot take:",
  "Am I the only one who",
  "Can we talk about",
  "Here's why",
]

const TRENDING_HASHTAGS = [
  "#AI",
  "#Tech",
  "#Startup",
  "#Innovation",
  "#Future",
  "#Trending",
  "#Breaking",
  "#News",
  "#Viral",
  "#MustRead",
]

function improveEngagement(text: string): { text: string; changes: string[] } {
  let improved = text
  const changes: string[] = []

  // Add question if none exists
  if (!text.includes("?") && !text.toLowerCase().includes("thoughts")) {
    improved += " What are your thoughts?"
    changes.push("Added engagement question")
  }

  // Add power words if missing
  const hasEmotionalWords = POWER_WORDS.some((word) => text.toLowerCase().includes(word.toLowerCase()))

  if (!hasEmotionalWords && improved.length < 200) {
    // Find a good spot to add a power word
    if (improved.toLowerCase().includes("this is")) {
      improved = improved.replace(/this is/i, "This is incredible")
      changes.push("Added emotional impact word")
    }
  }

  return { text: improved, changes }
}

function improveStructure(text: string): { text: string; changes: string[] } {
  let improved = text
  const changes: string[] = []

  // Add engagement starter if tweet is plain
  const hasEngagementStarter = ENGAGEMENT_STARTERS.some((starter) => text.toLowerCase().includes(starter.toLowerCase()))

  if (!hasEngagementStarter && text.length < 150) {
    // Randomly select an appropriate starter
    const starter = ENGAGEMENT_STARTERS[Math.floor(Math.random() * ENGAGEMENT_STARTERS.length)]
    improved = `${starter} ${improved.toLowerCase()}`
    changes.push("Added engagement starter phrase")
  }

  return { text: improved, changes }
}

function improveHashtags(text: string): { text: string; changes: string[] } {
  let improved = text
  const changes: string[] = []

  const currentHashtags = (text.match(/#\w+/g) || []).length

  if (currentHashtags === 0) {
    // Add 1-2 relevant hashtags
    const relevantTags = TRENDING_HASHTAGS.slice(0, 2)
    improved += ` ${relevantTags.join(" ")}`
    changes.push("Added trending hashtags for discoverability")
  } else if (currentHashtags > 3) {
    // Remove excess hashtags
    const hashtags = text.match(/#\w+/g) || []
    const keepHashtags = hashtags.slice(0, 3)

    hashtags.forEach((tag) => {
      if (!keepHashtags.includes(tag)) {
        improved = improved.replace(tag, "")
      }
    })

    improved = improved.replace(/\s+/g, " ").trim()
    changes.push("Reduced hashtags to optimal number (1-3)")
  }

  return { text: improved, changes }
}

function optimizeLength(text: string): { text: string; changes: string[] } {
  let improved = text
  const changes: string[] = []

  if (text.length < 80) {
    // Too short - suggest expansion
    if (!text.includes("because") && !text.includes("here's why")) {
      improved += " Here's why this matters:"
      changes.push("Added context to increase length and engagement")
    }
  } else if (text.length > 250) {
    // Too long - suggest condensing
    improved = improved.substring(0, 240) + "..."
    changes.push("Condensed tweet to optimal length")
  }

  return { text: improved, changes }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Tweet text is required" }, { status: 400 })
    }

    let improved = text
    let allChanges: string[] = []

    // Apply standard improvements
    const engagementResult = improveEngagement(improved)
    improved = engagementResult.text
    allChanges = [...allChanges, ...engagementResult.changes]

    const structureResult = improveStructure(improved)
    improved = structureResult.text
    allChanges = [...allChanges, ...structureResult.changes]

    const hashtagResult = improveHashtags(improved)
    improved = hashtagResult.text
    allChanges = [...allChanges, ...hashtagResult.changes]

    const lengthResult = optimizeLength(improved)
    improved = lengthResult.text
    allChanges = [...allChanges, ...lengthResult.changes]

    // Calculate expected score increase
    const expectedScoreIncrease = Math.min(allChanges.length * 8, 25)

    // Try to enhance with GPT-4o if available
    let gpt4oVersions: Array<{
      text: string
      changes: string[]
      expectedScoreIncrease: number
      reasoning: string
    }> = []
    let alternativeApproaches: string[] = []
    let hashtagSuggestions: {
      trending: string[]
      niche: string[]
      engagement: string[]
    } | undefined = undefined

    if (openRouterService.isConfigured()) {
      try {
        console.log("Generating GPT-4o enhanced suggestions...")
        
        // Get GPT-4o analysis first
        const gpt4oAnalysis = await openRouterService.analyzeTweetContent(text)
        
        // Generate enhanced suggestions
        const gpt4oSuggestions = await openRouterService.generateTweetSuggestions(text, gpt4oAnalysis)
        gpt4oVersions = gpt4oSuggestions.improvedVersions
        alternativeApproaches = gpt4oSuggestions.alternativeApproaches
        
        // Get hashtag suggestions
        hashtagSuggestions = await openRouterService.suggestHashtags(text)
        
        console.log("GPT-4o suggestions generated successfully")
      } catch (gpt4oError) {
        console.warn("GPT-4o suggestions failed, continuing with standard suggestions:", gpt4oError)
        // Continue with standard suggestions if GPT-4o fails
      }
    } else {
      console.log("GPT-4o not configured, using standard suggestions")
    }

    const suggestion: ImprovementSuggestion = {
      original: text,
      improved: improved.trim(),
      changes: allChanges,
      expectedScoreIncrease,
      gpt4oVersions: gpt4oVersions.length > 0 ? gpt4oVersions : undefined,
      alternativeApproaches: alternativeApproaches.length > 0 ? alternativeApproaches : undefined,
      hashtagSuggestions,
    }

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error("Error generating improvements:", error)
    return NextResponse.json({ error: "Failed to generate improvements" }, { status: 500 })
  }
}
