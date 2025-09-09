"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, TrendingUp, Clock, MessageSquare, Hash, AtSign, Lightbulb } from "lucide-react"

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
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "High Viral Potential" }
    if (score >= 60) return { variant: "secondary" as const, text: "Good Potential" }
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
                <div className="text-sm text-muted-foreground">out of 100</div>
                <Badge {...getScoreBadge(analysis.score)} className="mt-2">
                  {getScoreBadge(analysis.score).text}
                </Badge>
              </div>
              <Progress value={analysis.score} className="w-full" />
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

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Improvement Suggestions
                </CardTitle>
                <CardDescription>AI-powered recommendations to boost your tweet's viral potential</CardDescription>
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
