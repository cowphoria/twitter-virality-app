'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TestTube, TrendingUp } from 'lucide-react';
import { ABTesting } from '@/components/ab-testing';

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

export default function ABTestingPage() {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [abTestResults, setAbTestResults] = useState<ABTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runABTest = async () => {
    if (!tweet.trim()) {
      setError('Please enter a tweet to test');
      return;
    }

    setLoading(true);
    setError(null);
    setAbTestResults(null);

    try {
      const response = await fetch('/api/ab-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalTweet: tweet.trim(),
          numVariants: 4
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run A/B test');
      }

      const results = await response.json();
      setAbTestResults(results);
    } catch (error) {
      console.error('Error running A/B test:', error);
      setError('Failed to run A/B test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant: TweetVariant) => {
    setTweet(variant.text);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TestTube className="h-8 w-8" />
          A/B Testing Lab
        </h1>
        <p className="text-muted-foreground">
          Test multiple versions of your tweet to find the most viral option. Our AI generates optimized variants and compares their performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Tweet</CardTitle>
              <CardDescription>
                Type your original tweet below and we'll generate optimized variants for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's happening? Share your thoughts and we'll optimize them for maximum virality..."
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={280}
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {tweet.length}/280 characters
                </div>
                <Button
                  onClick={runABTest}
                  disabled={loading || !tweet.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4" />
                      Run A/B Test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Examples</CardTitle>
              <CardDescription>
                Try these examples to see how A/B testing works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Just launched our new AI-powered analytics dashboard! 🚀",
                  "The future of web development is here. What do you think?",
                  "Breaking: New study shows 90% of startups fail due to this one mistake",
                  "How do you stay productive as a developer? Share your tips below! 👇"
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setTweet(example)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div className="truncate">{example}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6">
                <div className="text-red-600 dark:text-red-400">{error}</div>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <div className="text-lg font-medium mb-2">Running A/B Test</div>
                    <div className="text-sm text-muted-foreground">
                      Generating optimized variants and analyzing performance...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {abTestResults && (
            <ABTesting
              originalTweet={abTestResults.originalTweet}
              variants={abTestResults.variants}
              onVariantSelect={handleVariantSelect}
            />
          )}

          {!loading && !abTestResults && !error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="text-lg font-medium mb-2">Ready to Test</div>
                  <div className="text-sm text-muted-foreground">
                    Enter a tweet above and click "Run A/B Test" to see optimized variants
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How A/B Testing Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Generate Variants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI creates multiple optimized versions of your tweet, each with different strategies for maximum engagement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Compare Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each variant is scored based on engagement potential, viral factors, and AI analysis to find the best performer.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Optimize & Deploy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select the best-performing variant and use it for your actual tweet, or get insights for future content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
