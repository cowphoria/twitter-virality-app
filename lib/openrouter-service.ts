interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. GPT-4o features will be disabled.');
    }
  }

  /**
   * Make a request to OpenRouter API
   */
  private async makeRequest(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Twitter Virality App',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * Analyze tweet content for virality potential using GPT-4o
   */
  async analyzeTweetContent(text: string): Promise<{
    viralityScore: number;
    contentAnalysis: {
      emotionalImpact: number;
      engagementPotential: number;
      clarityScore: number;
      trendingRelevance: number;
    };
    detailedInsights: string[];
    improvementAreas: string[];
  }> {
    const systemPrompt = `You are an expert social media analyst specializing in Twitter virality. Analyze the given tweet for its potential to go viral.

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.

Return your analysis in this exact JSON format:
{
  "viralityScore": number (0-100),
  "contentAnalysis": {
    "emotionalImpact": number (0-100),
    "engagementPotential": number (0-100), 
    "clarityScore": number (0-100),
    "trendingRelevance": number (0-100)
  },
  "detailedInsights": [string array of 3-5 specific insights],
  "improvementAreas": [string array of 2-4 areas for improvement]
}

Consider these factors:
- Emotional resonance and impact
- Engagement hooks (questions, calls-to-action, controversy)
- Content clarity and readability
- Trending topic relevance
- Optimal length and structure
- Hashtag usage
- Mention strategy
- Timing considerations

Be specific and actionable in your insights.`;

    const userPrompt = `Analyze this tweet for viral potential:\n\n"${text}"`;

    try {
      const response = await this.makeRequest({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from GPT-4o');
      }

      // Clean and parse JSON response (handle markdown code blocks)
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const analysis = JSON.parse(cleanContent);
      
      // Validate the response structure
      if (typeof analysis.viralityScore !== 'number' || 
          !analysis.contentAnalysis || 
          !Array.isArray(analysis.detailedInsights) ||
          !Array.isArray(analysis.improvementAreas)) {
        throw new Error('Invalid response format from GPT-4o');
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing tweet with GPT-4o:', error);
      throw error;
    }
  }

  /**
   * Generate improved tweet suggestions using GPT-4o
   */
  async generateTweetSuggestions(originalText: string, analysis?: any): Promise<{
    improvedVersions: Array<{
      text: string;
      changes: string[];
      expectedScoreIncrease: number;
      reasoning: string;
    }>;
    alternativeApproaches: string[];
  }> {
    const systemPrompt = `You are a Twitter optimization expert. Given a tweet and its analysis, generate improved versions that maximize viral potential.

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.

Return your response in this exact JSON format:
{
  "improvedVersions": [
    {
      "text": "improved tweet text",
      "changes": ["list of specific changes made"],
      "expectedScoreIncrease": number (0-50),
      "reasoning": "explanation of why this version is better"
    }
  ],
  "alternativeApproaches": ["2-3 different conceptual approaches to the same topic"]
}

Guidelines:
- Keep the core message intact
- Optimize for engagement, clarity, and emotional impact
- Consider trending topics and current events
- Use power words and emotional triggers appropriately
- Maintain authenticity
- Ensure optimal length (100-280 characters)
- Add relevant hashtags (1-3 max)
- Include engagement hooks when appropriate`;

    const userPrompt = `Original tweet: "${originalText}"

${analysis ? `Analysis insights: ${JSON.stringify(analysis.detailedInsights)}` : ''}

Generate 3 improved versions with different optimization strategies.`;

    try {
      const response = await this.makeRequest({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from GPT-4o');
      }

      // Clean and parse JSON response (handle markdown code blocks)
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const suggestions = JSON.parse(cleanContent);
      
      // Validate response structure
      if (!Array.isArray(suggestions.improvedVersions) || 
          !Array.isArray(suggestions.alternativeApproaches)) {
        throw new Error('Invalid response format from GPT-4o');
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions with GPT-4o:', error);
      throw error;
    }
  }

  /**
   * Get contextual hashtag suggestions using GPT-4o
   */
  async suggestHashtags(text: string): Promise<{
    trending: string[];
    niche: string[];
    engagement: string[];
  }> {
    const systemPrompt = `You are a hashtag optimization expert. Suggest relevant hashtags for the given tweet.

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.

Return your response in this exact JSON format:
{
  "trending": ["2-3 currently trending hashtags relevant to the content"],
  "niche": ["2-3 niche-specific hashtags for targeted reach"],
  "engagement": ["1-2 hashtags designed to encourage engagement"]
}

Guidelines:
- Only suggest hashtags that are genuinely relevant
- Consider current trends and events
- Balance broad appeal with niche targeting
- Avoid overused or spammy hashtags
- Keep hashtags readable and professional`;

    const userPrompt = `Suggest hashtags for this tweet: "${text}"`;

    try {
      const response = await this.makeRequest({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from GPT-4o');
      }

      // Clean and parse JSON response (handle markdown code blocks)
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const hashtags = JSON.parse(cleanContent);
      
      // Validate response structure
      if (!Array.isArray(hashtags.trending) || 
          !Array.isArray(hashtags.niche) ||
          !Array.isArray(hashtags.engagement)) {
        throw new Error('Invalid response format from GPT-4o');
      }

      return hashtags;
    } catch (error) {
      console.error('Error suggesting hashtags with GPT-4o:', error);
      throw error;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get usage statistics for monitoring
   */
  getUsageStats(): { configured: boolean; model: string } {
    return {
      configured: this.isConfigured(),
      model: 'openai/gpt-4o'
    };
  }
}

// Export a singleton instance
export const openRouterService = new OpenRouterService();
