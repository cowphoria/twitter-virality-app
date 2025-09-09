'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  TestTube, 
  TrendingUp, 
  Copy, 
  RefreshCw, 
  BarChart3, 
  Target,
  Zap,
  Users,
  MessageSquare,
  Hash
} from 'lucide-react';

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

interface ABTestingProps {
  originalTweet: string;
  variants: TweetVariant[];
  onVariantSelect?: (variant: TweetVariant) => void;
  className?: string;
}

export function ABTesting({ originalTweet, variants, onVariantSelect, className }: ABTestingProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getScoreColor = (score: number): string => {
    if (score >= 400) return 'text-green-600';
    if (score >= 300) return 'text-yellow-600';
    if (score >= 200) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 400) return { variant: 'default' as const, text: 'Excellent', className: 'bg-green-100 text-green-800' };
    if (score >= 300) return { variant: 'secondary' as const, text: 'Good', className: 'bg-yellow-100 text-yellow-800' };
    if (score >= 200) return { variant: 'outline' as const, text: 'Fair', className: 'bg-orange-100 text-orange-800' };
    return { variant: 'destructive' as const, text: 'Poor', className: 'bg-red-100 text-red-800' };
  };

  const getBestVariant = (): TweetVariant => {
    return variants.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  };

  const getWorstVariant = (): TweetVariant => {
    return variants.reduce((worst, current) => 
      current.score < worst.score ? current : worst
    );
  };

  const calculateImprovement = (variant: TweetVariant, original: TweetVariant): number => {
    return ((variant.score - original.score) / original.score) * 100;
  };

  const bestVariant = getBestVariant();
  const worstVariant = getWorstVariant();
  const originalVariant = variants[0]; // Assuming first is original

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          A/B Testing Results
        </CardTitle>
        <CardDescription>
          Compare different versions of your tweet to find the most viral option
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{bestVariant.score}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Best Score</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              {bestVariant === originalVariant ? 'Original' : 'Variant'}
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">
              {variants.length}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Variants</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Tested
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600">
              +{calculateImprovement(bestVariant, originalVariant).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Improvement</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              vs Original
            </div>
          </div>
        </div>

        {/* Variant Comparison */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Variant Comparison
          </h4>
          
          {variants.map((variant, index) => {
            const isOriginal = index === 0;
            const isBest = variant === bestVariant;
            const improvement = calculateImprovement(variant, originalVariant);
            
            return (
              <div
                key={variant.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedVariant === variant.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${isBest ? 'ring-2 ring-green-200 dark:ring-green-800' : ''}`}
                onClick={() => setSelectedVariant(variant.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={isOriginal ? 'default' : 'secondary'}>
                      {isOriginal ? 'Original' : `Variant ${index}`}
                    </Badge>
                    {isBest && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <Target className="h-3 w-3 mr-1" />
                        Best
                      </Badge>
                    )}
                    {improvement > 0 && !isOriginal && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        +{improvement.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(variant.score)}`}>
                      {variant.score}
                    </div>
                    <Badge {...getScoreBadge(variant.score)} className="text-xs">
                      {getScoreBadge(variant.score).text}
                    </Badge>
                  </div>
                </div>

                {/* Tweet Text */}
                <div className="mb-3">
                  <Textarea
                    value={variant.text}
                    readOnly
                    className="min-h-[60px] resize-none bg-muted/50"
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Characters</div>
                    <div className="text-lg font-bold">{variant.characterCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Hashtags</div>
                    <div className="text-lg font-bold">{variant.hashtagCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Mentions</div>
                    <div className="text-lg font-bold">{variant.mentionCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">AI Score</div>
                    <div className="text-lg font-bold text-purple-600">
                      {variant.gpt4oAnalysis?.viralityScore || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Factor Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">Engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={variant.factors.engagement} className="w-16 h-1" />
                      <span className="text-xs w-8">{Math.round(variant.factors.engagement)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">Hashtags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={variant.factors.hashtags} className="w-16 h-1" />
                      <span className="text-xs w-8">{Math.round(variant.factors.hashtags)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(variant.text);
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVariantSelect?.(variant);
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Use This
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(showDetails === variant.id ? null : variant.id);
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    {showDetails === variant.id ? 'Hide' : 'Details'}
                  </Button>
                </div>

                {/* Detailed Analysis */}
                {showDetails === variant.id && variant.gpt4oAnalysis && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-medium mb-1">Emotional Impact</div>
                        <Progress value={variant.gpt4oAnalysis.contentAnalysis.emotionalImpact} className="h-1" />
                        <div className="text-xs text-muted-foreground">
                          {variant.gpt4oAnalysis.contentAnalysis.emotionalImpact}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">Engagement Potential</div>
                        <Progress value={variant.gpt4oAnalysis.contentAnalysis.engagementPotential} className="h-1" />
                        <div className="text-xs text-muted-foreground">
                          {variant.gpt4oAnalysis.contentAnalysis.engagementPotential}%
                        </div>
                      </div>
                    </div>
                    
                    {variant.gpt4oAnalysis.detailedInsights.length > 0 && (
                      <div>
                        <div className="text-xs font-medium mb-2">Key Insights</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {variant.gpt4oAnalysis.detailedInsights.slice(0, 3).map((insight, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Recommendation
            </span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {bestVariant === originalVariant ? (
              "Your original tweet is already performing well! Consider the insights from other variants for future tweets."
            ) : (
              `Variant ${variants.indexOf(bestVariant)} shows the best potential with a ${calculateImprovement(bestVariant, originalVariant).toFixed(1)}% improvement over the original.`
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
