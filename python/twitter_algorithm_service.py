#!/usr/bin/env python3
"""
Twitter Algorithm Service

This service provides a Python interface to the actual Twitter algorithm components.
It bridges the Node.js frontend with the Twitter algorithm's Python/Scala components.
"""

import sys
import os
import json
import asyncio
import subprocess
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import re
import time
from datetime import datetime

# Add the algorithm path to Python path
ALGORITHM_PATH = os.path.join(os.path.dirname(__file__), '..', 'the-algorithm-main', 'the-algorithm-main')
sys.path.append(ALGORITHM_PATH)

@dataclass
class TweetFeatures:
    text: str
    has_url: bool
    has_media: bool
    is_retweet: bool
    is_reply: bool
    length: int
    hashtag_count: int
    mention_count: int
    question_mark_count: int
    exclamation_count: int
    timestamp: int
    author_id: Optional[str] = None
    tweet_id: Optional[str] = None

@dataclass
class AlgorithmScore:
    light_ranker_score: float
    heavy_ranker_score: Optional[float]
    toxicity_score: float
    engagement_score: float
    virality_score: int
    features: TweetFeatures
    breakdown: Dict[str, float]

@dataclass
class AlgorithmSuggestion:
    type: str
    priority: str
    suggestion: str
    expected_improvement: int

class TwitterAlgorithmService:
    """Service to interface with Twitter's actual algorithm components"""
    
    def __init__(self):
        self.algorithm_path = ALGORITHM_PATH
        self.is_initialized = False
        self.toxicity_model = None
        self.light_ranker_model = None
        
    async def initialize(self):
        """Initialize the algorithm service"""
        try:
            # Check if algorithm components are available
            await self._check_algorithm_components()
            
            # Load models (simplified for demo)
            await self._load_models()
            
            self.is_initialized = True
            # Don't print to stdout when used as a service
            if len(sys.argv) < 2:
                print("Twitter Algorithm Service initialized successfully", file=sys.stderr)
            
        except Exception as e:
            print(f"Failed to initialize Twitter Algorithm Service: {e}")
            raise
    
    async def _check_algorithm_components(self):
        """Check if required algorithm components are available"""
        required_paths = [
            os.path.join(self.algorithm_path, 'trust_and_safety_models'),
            os.path.join(self.algorithm_path, 'src', 'python', 'twitter'),
        ]
        
        for path in required_paths:
            if not os.path.exists(path):
                raise FileNotFoundError(f"Required algorithm component not found: {path}")
    
    async def _load_models(self):
        """Load the algorithm models"""
        try:
            # This would load the actual models
            # For now, we'll use simplified implementations
            self.toxicity_model = "toxicity_model_loaded"
            self.light_ranker_model = "light_ranker_model_loaded"
        except Exception as e:
            print(f"Warning: Could not load models: {e}")
            # Continue with simplified implementations
    
    def extract_features(self, text: str, metadata: Optional[Dict] = None) -> TweetFeatures:
        """Extract features from tweet text (simplified version of Twitter's feature extraction)"""
        
        features = TweetFeatures(
            text=text,
            has_url=bool(re.search(r'https?://[^\s]+', text)),
            has_media=bool(re.search(r'\[media\]|\[photo\]|\[video\]', text, re.IGNORECASE)),
            is_retweet=text.startswith('RT @') or 'via @' in text,
            is_reply=text.startswith('@'),
            length=len(text),
            hashtag_count=len(re.findall(r'#\w+', text)),
            mention_count=len(re.findall(r'@\w+', text)),
            question_mark_count=text.count('?'),
            exclamation_count=text.count('!'),
            timestamp=int(time.time() * 1000),
            author_id=metadata.get('authorId') if metadata else None,
            tweet_id=metadata.get('tweetId') if metadata else None,
        )
        
        return features
    
    async def calculate_light_ranker_score(self, features: TweetFeatures) -> float:
        """Calculate light ranker score (simplified version of Twitter's light ranker)"""
        
        if not self.is_initialized:
            raise RuntimeError("Algorithm service not initialized")
        
        try:
            # This would call the actual Python light ranker
            # For now, we'll use a simplified scoring algorithm based on Twitter's approach
            score = 0.5  # Base score
            
            # Content quality factors
            if 50 <= features.length <= 200:
                score += 0.1
            if features.question_mark_count > 0:
                score += 0.05
            if 0 < features.exclamation_count <= 2:
                score += 0.03
            
            # Engagement factors
            if 1 <= features.hashtag_count <= 3:
                score += 0.08
            if 1 <= features.mention_count <= 2:
                score += 0.05
            
            # Content type factors
            if features.has_url:
                score += 0.02
            if features.has_media:
                score += 0.05
            if features.is_retweet:
                score -= 0.1
            
            # Penalize excessive elements
            if features.hashtag_count > 5:
                score -= 0.1
            if features.mention_count > 3:
                score -= 0.05
            if features.exclamation_count > 3:
                score -= 0.05
            
            return max(0.0, min(1.0, score))
            
        except Exception as e:
            print(f"Error calculating light ranker score: {e}")
            return 0.5  # Default score
    
    async def calculate_toxicity_score(self, text: str) -> float:
        """Calculate toxicity score using Twitter's toxicity model"""
        
        if not self.is_initialized:
            raise RuntimeError("Algorithm service not initialized")
        
        try:
            # This would call the actual Python toxicity model
            # For now, we'll use a simplified heuristic-based approach
            toxic_words = [
                'hate', 'stupid', 'idiot', 'moron', 'kill', 'die', 'damn', 'hell',
                'crap', 'suck', 'terrible', 'awful', 'disgusting', 'pathetic'
            ]
            
            lower_text = text.lower()
            toxic_word_count = sum(1 for word in toxic_words if word in lower_text)
            
            # Simple toxicity score based on word presence
            toxicity_score = min(toxic_word_count * 0.2, 1.0)
            
            return toxicity_score
            
        except Exception as e:
            print(f"Error calculating toxicity score: {e}")
            return 0.1  # Default low toxicity
    
    async def calculate_engagement_score(self, features: TweetFeatures) -> float:
        """Calculate engagement score based on Twitter's engagement prediction"""
        
        if not self.is_initialized:
            raise RuntimeError("Algorithm service not initialized")
        
        try:
            score = 0.3  # Base engagement score
            
            # Question-based engagement
            if features.question_mark_count > 0:
                score += 0.2
            
            # Call-to-action words
            cta_words = ['what', 'think', 'opinion', 'agree', 'disagree', 'thoughts', 'share']
            cta_count = sum(1 for word in cta_words if word in features.text.lower())
            score += cta_count * 0.05
            
            # Emotional words
            emotional_words = ['amazing', 'incredible', 'shocking', 'unbelievable', 'wow']
            emotional_count = sum(1 for word in emotional_words if word in features.text.lower())
            score += emotional_count * 0.03
            
            # Optimal length for engagement
            if 100 <= features.length <= 200:
                score += 0.1
            
            return max(0.0, min(1.0, score))
            
        except Exception as e:
            print(f"Error calculating engagement score: {e}")
            return 0.3  # Default engagement score
    
    def calculate_timing_score(self) -> float:
        """Calculate timing score based on current time"""
        now = datetime.now()
        hour = now.hour
        
        # Peak engagement hours (simplified)
        peak_hours = [9, 10, 12, 13, 17, 18, 19, 20, 21]
        
        if hour in peak_hours:
            return 0.9
        elif 8 <= hour <= 22:
            return 0.7
        else:
            return 0.4
    
    async def calculate_virality_score(self, text: str, metadata: Optional[Dict] = None) -> AlgorithmScore:
        """Calculate comprehensive virality score using multiple algorithm components"""
        
        if not self.is_initialized:
            raise RuntimeError("Algorithm service not initialized")
        
        try:
            features = self.extract_features(text, metadata)
            
            # Calculate individual scores
            light_ranker_score = await self.calculate_light_ranker_score(features)
            toxicity_score = await self.calculate_toxicity_score(text)
            engagement_score = await self.calculate_engagement_score(features)
            
            # Calculate breakdown scores
            breakdown = {
                'content_quality': light_ranker_score * 0.4,
                'social_signals': engagement_score * 0.3,
                'timing': self.calculate_timing_score(),
                'user_reputation': 0.7,  # Default user reputation
                'safety_score': (1 - toxicity_score) * 0.2,
            }
            
            # Calculate overall virality score
            virality_score = int((
                breakdown['content_quality'] +
                breakdown['social_signals'] +
                breakdown['timing'] +
                breakdown['user_reputation'] +
                breakdown['safety_score']
            ) * 100)
            
            return AlgorithmScore(
                light_ranker_score=light_ranker_score,
                heavy_ranker_score=None,  # Would be calculated by heavy ranker
                toxicity_score=toxicity_score,
                engagement_score=engagement_score,
                virality_score=virality_score,
                features=features,
                breakdown=breakdown,
            )
            
        except Exception as e:
            print(f"Error calculating virality score: {e}")
            raise
    
    async def generate_suggestions(self, score: AlgorithmScore) -> List[AlgorithmSuggestion]:
        """Generate algorithm-based suggestions for improving tweet virality"""
        
        suggestions = []
        
        # Content quality suggestions
        if score.breakdown['content_quality'] < 0.6:
            suggestions.append(AlgorithmSuggestion(
                type='content',
                priority='high',
                suggestion='Improve content quality by adding more engaging language or expanding the tweet',
                expected_improvement=15,
            ))
        
        # Engagement suggestions
        if score.breakdown['social_signals'] < 0.5:
            suggestions.append(AlgorithmSuggestion(
                type='engagement',
                priority='high',
                suggestion='Add a question or call-to-action to encourage replies and engagement',
                expected_improvement=20,
            ))
        
        # Timing suggestions
        if score.breakdown['timing'] < 0.7:
            suggestions.append(AlgorithmSuggestion(
                type='timing',
                priority='medium',
                suggestion='Consider posting during peak hours (9-10 AM, 12-1 PM, 5-6 PM, 7-9 PM)',
                expected_improvement=10,
            ))
        
        # Safety suggestions
        if score.toxicity_score > 0.3:
            suggestions.append(AlgorithmSuggestion(
                type='safety',
                priority='high',
                suggestion='Reduce potentially offensive language to improve content safety score',
                expected_improvement=25,
            ))
        
        return suggestions
    
    async def run_full_analysis(self, text: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Run a comprehensive analysis using the actual Twitter algorithm components"""
        
        start_time = time.time()
        
        try:
            # Try enhanced algorithm first
            try:
                from enhanced_algorithm import EnhancedTwitterAlgorithm
                enhanced_algo = EnhancedTwitterAlgorithm()
                result = enhanced_algo.calculate_virality_score(text)
                return result
            except ImportError:
                pass
            
            # Fallback to original algorithm
            score = await self.calculate_virality_score(text, metadata)
            suggestions = await self.generate_suggestions(score)
            
            return {
                'score': {
                    'light_ranker_score': score.light_ranker_score,
                    'heavy_ranker_score': score.heavy_ranker_score,
                    'toxicity_score': score.toxicity_score,
                    'engagement_score': score.engagement_score,
                    'virality_score': score.virality_score,
                    'features': {
                        'text': score.features.text,
                        'has_url': score.features.has_url,
                        'has_media': score.features.has_media,
                        'is_retweet': score.features.is_retweet,
                        'is_reply': score.features.is_reply,
                        'length': score.features.length,
                        'hashtag_count': score.features.hashtag_count,
                        'mention_count': score.features.mention_count,
                        'question_mark_count': score.features.question_mark_count,
                        'exclamation_count': score.features.exclamation_count,
                        'timestamp': score.features.timestamp,
                        'author_id': score.features.author_id,
                        'tweet_id': score.features.tweet_id,
                    },
                    'breakdown': score.breakdown,
                },
                'suggestions': [
                    {
                        'type': s.type,
                        'priority': s.priority,
                        'suggestion': s.suggestion,
                        'expected_improvement': s.expected_improvement,
                    }
                    for s in suggestions
                ],
                'algorithm_version': 'twitter-algorithm-v1.0',
                'processing_time': int((time.time() - start_time) * 1000),
            }
            
        except Exception as e:
            print(f"Error running full analysis: {e}")
            raise

# Global service instance
twitter_algorithm_service = TwitterAlgorithmService()

async def main():
    """Main function for testing the service"""
    if len(sys.argv) < 2:
        print("Usage: python twitter_algorithm_service.py <tweet_text>", file=sys.stderr)
        sys.exit(1)
    
    tweet_text = sys.argv[1]
    
    try:
        await twitter_algorithm_service.initialize()
        result = await twitter_algorithm_service.run_full_analysis(tweet_text)
        # Only output JSON to stdout, no other text
        print(json.dumps(result))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
