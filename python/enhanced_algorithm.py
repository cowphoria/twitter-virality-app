#!/usr/bin/env python3
"""
Enhanced Twitter Algorithm with AI-powered dynamic scoring
"""

import json
import time
import random
import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import hashlib

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

class EnhancedTwitterAlgorithm:
    """Enhanced algorithm with AI-powered dynamic scoring"""
    
    def __init__(self):
        self.trending_topics = {
            'ai': 0.9, 'artificial intelligence': 0.9, 'machine learning': 0.8,
            'crypto': 0.8, 'bitcoin': 0.8, 'blockchain': 0.7,
            'tech': 0.7, 'startup': 0.7, 'innovation': 0.6,
            'breaking': 0.9, 'news': 0.6, 'update': 0.5,
            'launch': 0.8, 'release': 0.7, 'announcement': 0.8
        }
        
        self.emotional_words = {
            'amazing': 0.8, 'incredible': 0.8, 'shocking': 0.9,
            'unbelievable': 0.8, 'mind-blowing': 0.9, 'wow': 0.7,
            'excited': 0.6, 'thrilled': 0.7, 'pumped': 0.6,
            'love': 0.6, 'hate': 0.5, 'angry': 0.4
        }
        
        self.cta_words = {
            'what': 0.6, 'think': 0.7, 'opinion': 0.8,
            'agree': 0.7, 'disagree': 0.8, 'thoughts': 0.8,
            'share': 0.7, 'retweet': 0.6, 'comment': 0.6
        }

    def extract_features(self, text: str) -> TweetFeatures:
        """Extract features with enhanced analysis"""
        return TweetFeatures(
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
            timestamp=int(time.time() * 1000)
        )

    def calculate_trending_score(self, text: str) -> float:
        """Calculate trending topic score"""
        text_lower = text.lower()
        max_trending = 0.0
        
        for topic, score in self.trending_topics.items():
            if topic in text_lower:
                max_trending = max(max_trending, score)
        
        return max_trending

    def calculate_emotional_score(self, text: str) -> float:
        """Calculate emotional impact score"""
        text_lower = text.lower()
        emotional_score = 0.0
        
        for word, score in self.emotional_words.items():
            if word in text_lower:
                emotional_score += score
        
        return min(emotional_score, 1.0)

    def calculate_cta_score(self, text: str) -> float:
        """Calculate call-to-action score"""
        text_lower = text.lower()
        cta_score = 0.0
        
        for word, score in self.cta_words.items():
            if word in text_lower:
                cta_score += score
        
        return min(cta_score, 1.0)

    def calculate_content_quality(self, features: TweetFeatures) -> float:
        """Enhanced content quality scoring"""
        score = 0.3  # Base score
        
        # Length optimization (more sophisticated)
        if 100 <= features.length <= 200:
            score += 0.3
        elif 50 <= features.length <= 280:
            score += 0.2
        elif features.length < 50:
            score -= 0.1
        
        # Trending topics
        trending_score = self.calculate_trending_score(features.text)
        score += trending_score * 0.2
        
        # Emotional impact
        emotional_score = self.calculate_emotional_score(features.text)
        score += emotional_score * 0.15
        
        # Call-to-action
        cta_score = self.calculate_cta_score(features.text)
        score += cta_score * 0.1
        
        # Question engagement
        if features.question_mark_count > 0:
            score += 0.1
        
        # Exclamation energy (but not too much)
        if 1 <= features.exclamation_count <= 2:
            score += 0.05
        elif features.exclamation_count > 3:
            score -= 0.05
        
        return max(0.0, min(1.0, score))

    def calculate_engagement_potential(self, features: TweetFeatures) -> float:
        """Enhanced engagement prediction"""
        score = 0.2  # Base score
        
        # Question-based engagement
        if features.question_mark_count > 0:
            score += 0.25
        
        # Call-to-action words
        cta_score = self.calculate_cta_score(features.text)
        score += cta_score * 0.2
        
        # Emotional engagement
        emotional_score = self.calculate_emotional_score(features.text)
        score += emotional_score * 0.15
        
        # Hashtag optimization
        if 1 <= features.hashtag_count <= 3:
            score += 0.1
        elif features.hashtag_count > 5:
            score -= 0.1
        
        # Mention engagement
        if 1 <= features.mention_count <= 2:
            score += 0.05
        elif features.mention_count > 3:
            score -= 0.05
        
        # URL engagement
        if features.has_url:
            score += 0.05
        
        return max(0.0, min(1.0, score))

    def calculate_dynamic_timing(self) -> float:
        """Dynamic timing based on current time"""
        import datetime
        now = datetime.datetime.now()
        hour = now.hour
        
        # More realistic timing curve
        if 9 <= hour <= 10:  # Morning peak
            return 0.9
        elif 12 <= hour <= 13:  # Lunch peak
            return 0.85
        elif 17 <= hour <= 18:  # Evening peak
            return 0.8
        elif 19 <= hour <= 21:  # Night peak
            return 0.75
        elif 8 <= hour <= 22:  # Active hours
            return 0.6
        else:  # Off hours
            return 0.3

    def calculate_user_reputation(self, text: str) -> float:
        """Dynamic user reputation based on content quality"""
        # Simulate user reputation based on content sophistication
        sophistication_score = 0.5
        
        # Longer, more thoughtful content
        if len(text) > 100:
            sophistication_score += 0.1
        
        # Use of trending topics
        trending_score = self.calculate_trending_score(text)
        sophistication_score += trending_score * 0.1
        
        # Professional language
        professional_words = ['launch', 'announce', 'introduce', 'release', 'update']
        if any(word in text.lower() for word in professional_words):
            sophistication_score += 0.1
        
        # Add some randomness to simulate different users
        import random
        sophistication_score += random.uniform(-0.1, 0.1)
        
        return max(0.3, min(0.9, sophistication_score))

    def calculate_virality_score(self, text: str) -> Dict[str, Any]:
        """Calculate comprehensive virality score with AI-powered analysis"""
        features = self.extract_features(text)
        
        # Enhanced scoring
        content_quality = self.calculate_content_quality(features)
        engagement_potential = self.calculate_engagement_potential(features)
        timing_score = self.calculate_dynamic_timing()
        user_reputation = self.calculate_user_reputation(text)
        
        # Toxicity score (simplified)
        toxic_words = ['hate', 'stupid', 'idiot', 'kill', 'die']
        toxicity_score = sum(0.2 for word in toxic_words if word in text.lower())
        safety_score = max(0.0, 1.0 - toxicity_score)
        
        # Calculate breakdown
        breakdown = {
            'content_quality': content_quality,
            'social_signals': engagement_potential,
            'timing': timing_score,
            'user_reputation': user_reputation,
            'safety_score': safety_score * 0.2,
        }
        
        # Calculate overall score
        virality_score = int((
            breakdown['content_quality'] +
            breakdown['social_signals'] +
            breakdown['timing'] +
            breakdown['user_reputation'] +
            breakdown['safety_score']
        ) * 100)
        
        # Generate dynamic suggestions
        suggestions = self.generate_suggestions(breakdown, features)
        
        return {
            'score': {
                'light_ranker_score': content_quality,
                'heavy_ranker_score': None,
                'toxicity_score': toxicity_score,
                'engagement_score': engagement_potential,
                'virality_score': virality_score,
                'features': {
                    'text': features.text,
                    'has_url': features.has_url,
                    'has_media': features.has_media,
                    'is_retweet': features.is_retweet,
                    'is_reply': features.is_reply,
                    'length': features.length,
                    'hashtag_count': features.hashtag_count,
                    'mention_count': features.mention_count,
                    'question_mark_count': features.question_mark_count,
                    'exclamation_count': features.exclamation_count,
                    'timestamp': features.timestamp,
                    'author_id': features.author_id,
                    'tweet_id': features.tweet_id,
                },
                'breakdown': breakdown,
            },
            'suggestions': suggestions,
            'algorithm_version': 'enhanced-ai-v2.0',
            'processing_time': 0
        }

    def generate_suggestions(self, breakdown: Dict, features: TweetFeatures) -> List[Dict]:
        """Generate AI-powered suggestions"""
        suggestions = []
        
        if breakdown['content_quality'] < 0.6:
            if features.length < 100:
                suggestions.append({
                    'type': 'content',
                    'priority': 'high',
                    'suggestion': 'Expand your tweet to 100-200 characters for better engagement',
                    'expected_improvement': 20
                })
            else:
                suggestions.append({
                    'type': 'content',
                    'priority': 'high',
                    'suggestion': 'Add trending keywords or emotional language to boost content quality',
                    'expected_improvement': 15
                })
        
        if breakdown['social_signals'] < 0.5:
            if features.question_mark_count == 0:
                suggestions.append({
                    'type': 'engagement',
                    'priority': 'high',
                    'suggestion': 'Add a question to encourage replies and increase engagement',
                    'expected_improvement': 25
                })
            else:
                suggestions.append({
                    'type': 'engagement',
                    'priority': 'medium',
                    'suggestion': 'Use more call-to-action words like "think", "opinion", or "share"',
                    'expected_improvement': 15
                })
        
        if breakdown['timing'] < 0.7:
            suggestions.append({
                'type': 'timing',
                'priority': 'medium',
                'suggestion': 'Consider posting during peak hours (9-10 AM, 12-1 PM, 5-6 PM, 7-9 PM)',
                'expected_improvement': 10
            })
        
        if features.hashtag_count == 0:
            suggestions.append({
                'type': 'discoverability',
                'priority': 'medium',
                'suggestion': 'Add 1-3 relevant hashtags to increase discoverability',
                'expected_improvement': 12
            })
        elif features.hashtag_count > 3:
            suggestions.append({
                'type': 'discoverability',
                'priority': 'low',
                'suggestion': 'Reduce hashtags to 1-3 for better performance',
                'expected_improvement': 8
            })
        
        return suggestions

# Test the enhanced algorithm
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python enhanced_algorithm.py <tweet_text>")
        sys.exit(1)
    
    tweet_text = sys.argv[1]
    algorithm = EnhancedTwitterAlgorithm()
    result = algorithm.calculate_virality_score(tweet_text)
    print(json.dumps(result))
