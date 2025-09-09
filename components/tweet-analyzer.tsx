"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, TrendingUp, Clock, MessageSquare, Hash, AtSign, Lightbulb, Copy, RefreshCw } from "lucide-react"

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

export function TweetAnalyzer() {
  const [tweet, setTweet] = useState("")
  const [analysis, setAnalysis] = useState<TweetAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeTweet = async () => {
    if (!tweet.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: tweet }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze tweet")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error("Error analyzing tweet:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 400) return "text-green-600"
    if (score >= 300) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 400) return { variant: "default" as const, text: "High Viral Potential" }
    if (score >= 300) return { variant: "secondary" as const, text: "Good Potential" }
    return { variant: "destructive" as const, text: "Low Potential" }
  }

  return (
    <div className="space-y-6">
      {/* Tweet Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analyze Your Tweet
          </CardTitle>
          <CardDescription>
            Enter your tweet text below to get a virality score and improvement suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What's happening? Write your tweet here..."
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={280}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{tweet.length}/280 characters</span>
              <Button onClick={analyzeTweet} disabled={!tweet.trim() || isAnalyzing} className="min-w-[120px]">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Tweet"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Virality Score</CardTitle>
              <CardDescription>Overall potential for viral engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</div>
                <div className="text-sm text-muted-foreground">out of 500</div>
                <Badge {...getScoreBadge(analysis.score)} className="mt-2">
                  {getScoreBadge(analysis.score).text}
                </Badge>
              </div>
              <Progress value={(analysis.score / 500) * 100} className="w-full" />
            </CardContent>
          </Card>

          {/* Factor Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Factor Breakdown</CardTitle>
              <CardDescription>How each element contributes to virality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.factors.engagement} className="w-16 h-2" />
                    <span className="text-sm font-mono w-8">{Math.round(analysis.factors.engagement)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Timing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.factors.timing} className="w-16 h-2" />
                    <span className="text-sm font-mono w-8">{Math.round(analysis.factors.timing)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.factors.content} className="w-16 h-2" />
                    <span className="text-sm font-mono w-8">{Math.round(analysis.factors.content)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Hashtags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.factors.hashtags} className="w-16 h-2" />
                    <span className="text-sm font-mono w-8">{Math.round(analysis.factors.hashtags)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AtSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Mentions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.factors.mentions} className="w-16 h-2" />
                    <span className="text-sm font-mono w-8">{Math.round(analysis.factors.mentions)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GPT-4o Analysis */}
          {analysis.gpt4oAnalysis && (
            <Card className="md:col-span-2 border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <TrendingUp className="w-5 h-5" />
                  AI-Enhanced Analysis
                  <Badge variant="secondary" className="ml-auto">GPT-4o</Badge>
                </CardTitle>
                <CardDescription>
                  Advanced content analysis powered by GPT-4o
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* GPT-4o Virality Score */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysis.gpt4oAnalysis.viralityScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">AI Virality Score</div>
                </div>

                {/* Content Analysis Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Emotional Impact</div>
                    <Progress value={analysis.gpt4oAnalysis.contentAnalysis.emotionalImpact} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {analysis.gpt4oAnalysis.contentAnalysis.emotionalImpact}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Engagement Potential</div>
                    <Progress value={analysis.gpt4oAnalysis.contentAnalysis.engagementPotential} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {analysis.gpt4oAnalysis.contentAnalysis.engagementPotential}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Clarity Score</div>
                    <Progress value={analysis.gpt4oAnalysis.contentAnalysis.clarityScore} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {analysis.gpt4oAnalysis.contentAnalysis.clarityScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Trending Relevance</div>
                    <Progress value={analysis.gpt4oAnalysis.contentAnalysis.trendingRelevance} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {analysis.gpt4oAnalysis.contentAnalysis.trendingRelevance}%
                    </div>
                  </div>
                </div>

                {/* Detailed Insights */}
                {analysis.gpt4oAnalysis.detailedInsights.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Key Insights</div>
                    <ul className="space-y-1">
                      {analysis.gpt4oAnalysis.detailedInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvement Areas */}
                {analysis.gpt4oAnalysis.improvementAreas.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Areas for Improvement</div>
                    <ul className="space-y-1">
                      {analysis.gpt4oAnalysis.improvementAreas.map((area, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Suggestions */}
          {analysis.enhancedSuggestions && analysis.enhancedSuggestions.length > 0 && (
            <Card className="md:col-span-2 border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Lightbulb className="w-5 h-5" />
                  AI-Enhanced Suggestions
                  <Badge variant="secondary" className="ml-auto">GPT-4o</Badge>
                </CardTitle>
                <CardDescription>
                  Advanced optimization recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.enhancedSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white border border-green-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground leading-relaxed mb-2">{suggestion}</p>
                          
                          {/* Show suggested tweet if available */}
                          {analysis.gpt4oAnalysis && analysis.gpt4oAnalysis.improvedVersions && analysis.gpt4oAnalysis.improvedVersions[index] && (
                            <div className="mt-3 p-3 rounded-md bg-green-50 border border-green-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-green-700">Suggested Tweet:</span>
                                <Badge variant="outline" className="text-xs">
                                  {analysis.gpt4oAnalysis.improvedVersions[index].text.length}/280
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed mb-2">
                                "{analysis.gpt4oAnalysis.improvedVersions[index].text}"
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(analysis.gpt4oAnalysis.improvedVersions[index].text);
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setTweet(analysis.gpt4oAnalysis.improvedVersions[index].text);
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Use This
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Standard Suggestions */}
          {analysis.suggestions.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Standard Suggestions
                </CardTitle>
                <CardDescription>Basic recommendations to boost your tweet's viral potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
