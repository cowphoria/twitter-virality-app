"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Wand2, Copy, Check, RefreshCw, Sparkles } from "lucide-react"

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

export function TweetComposer() {
  const [originalTweet, setOriginalTweet] = useState("")
  const [suggestion, setSuggestion] = useState<ImprovementSuggestion | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const generateSuggestions = async () => {
    if (!originalTweet.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/suggest-improvements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: originalTweet }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const result = await response.json()
      setSuggestion(result)
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const useSuggestion = () => {
    if (suggestion) {
      setOriginalTweet(suggestion.improved)
      setSuggestion(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tweet Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Tweet Composer
          </CardTitle>
          <CardDescription>
            Write your tweet and get AI-powered suggestions to maximize viral potential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Start writing your tweet here..."
              value={originalTweet}
              onChange={(e) => setOriginalTweet(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={280}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{originalTweet.length}/280 characters</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOriginalTweet("")
                    setSuggestion(null)
                  }}
                  disabled={!originalTweet.trim()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={generateSuggestions}
                  disabled={!originalTweet.trim() || isGenerating}
                  className="min-w-[140px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Suggestions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestion && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Improved Version
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                +{suggestion.expectedScoreIncrease} points expected
              </Badge>
            </div>
            <CardDescription>Here's an optimized version of your tweet with AI improvements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Original vs Improved */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Original</h4>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm leading-relaxed">{suggestion.original}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{suggestion.original.length}/280</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(suggestion.original)}
                      className="h-6 px-2"
                    >
                      {copiedText === suggestion.original ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary">AI Improved</h4>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm leading-relaxed">{suggestion.improved}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/20">
                    <span className="text-xs text-muted-foreground">{suggestion.improved.length}/280</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(suggestion.improved)}
                      className="h-6 px-2"
                    >
                      {copiedText === suggestion.improved ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Changes Made */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Changes Made</h4>
              <div className="grid gap-2">
                {suggestion.changes.map((change, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-md bg-background/50">
                    <div className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground">{change}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button onClick={useSuggestion} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Use This Version
              </Button>
              <Button variant="outline" onClick={() => copyToClipboard(suggestion.improved)}>
                {copiedText === suggestion.improved ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Improved
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GPT-4o Enhanced Versions */}
      {suggestion?.gpt4oVersions && suggestion.gpt4oVersions.length > 0 && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Sparkles className="w-5 h-5" />
              AI-Enhanced Versions
              <Badge variant="secondary" className="ml-auto">GPT-4o</Badge>
            </CardTitle>
            <CardDescription>
              Advanced tweet optimizations powered by GPT-4o
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestion.gpt4oVersions.map((version, index) => (
              <div key={index} className="p-4 rounded-lg bg-white border border-purple-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium text-purple-700">Version {index + 1}</h4>
                  <Badge variant="outline" className="text-xs">
                    +{version.expectedScoreIncrease} score
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-purple-50 border border-purple-100">
                    <p className="text-sm leading-relaxed">{version.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-200">
                      <span className="text-xs text-muted-foreground">{version.text.length}/280</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(version.text)}
                        className="h-6 px-2"
                      >
                        {copiedText === version.text ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">Reasoning:</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{version.reasoning}</p>
                  </div>
                  
                  {version.changes.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-muted-foreground">Changes:</h5>
                      <ul className="space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start gap-2 text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOriginalTweet(version.text)
                      setSuggestion(null)
                    }}
                    className="w-full"
                  >
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Use This Version
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alternative Approaches */}
      {suggestion?.alternativeApproaches && suggestion.alternativeApproaches.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Wand2 className="w-5 h-5" />
              Alternative Approaches
              <Badge variant="secondary" className="ml-auto">GPT-4o</Badge>
            </CardTitle>
            <CardDescription>
              Different conceptual approaches to your topic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestion.alternativeApproaches.map((approach, index) => (
                <div key={index} className="p-3 rounded-lg bg-white border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{approach}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hashtag Suggestions */}
      {suggestion?.hashtagSuggestions && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Hash className="w-5 h-5" />
              Hashtag Suggestions
              <Badge variant="secondary" className="ml-auto">GPT-4o</Badge>
            </CardTitle>
            <CardDescription>
              Optimized hashtags for maximum reach and engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestion.hashtagSuggestions.trending.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Trending Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestion.hashtagSuggestions.trending.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {suggestion.hashtagSuggestions.niche.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Niche Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestion.hashtagSuggestions.niche.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {suggestion.hashtagSuggestions.engagement.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Engagement Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestion.hashtagSuggestions.engagement.map((tag, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips for Viral Tweets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium">Ask Questions</h5>
                <p className="text-xs text-muted-foreground">Questions encourage replies and boost engagement</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium">Use 1-3 Hashtags</h5>
                <p className="text-xs text-muted-foreground">Optimal hashtag count for maximum reach</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium">Post at Peak Hours</h5>
                <p className="text-xs text-muted-foreground">9-10 AM, 12-1 PM, 5-6 PM, 7-9 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium">Add Emotional Words</h5>
                <p className="text-xs text-muted-foreground">Words like "amazing" and "incredible" boost engagement</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
