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
