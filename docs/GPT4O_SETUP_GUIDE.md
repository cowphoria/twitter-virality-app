# 🤖 GPT-4o Integration Setup Guide

## Overview

This guide will help you set up GPT-4o integration via OpenRouter to enhance your Twitter Virality App with advanced AI-powered tweet analysis and suggestions.

## 🚀 Quick Setup

### 1. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Go to your [API Keys page](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the API key (starts with `sk-or-...`)

### 2. Configure Environment Variables

Create a `.env.local` file in your project root (or update existing one):

```bash
# OpenRouter GPT-4o Configuration
OPENROUTER_API_KEY="sk-or-your-api-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Set custom temperature for GPT-4o (default: 0.3 for analysis, 0.7 for suggestions)
OPENROUTER_TEMPERATURE_ANALYSIS="0.3"
OPENROUTER_TEMPERATURE_SUGGESTIONS="0.7"
```

### 3. Restart Your Development Server

```bash
npm run dev
```

## ✨ Features Added

### Enhanced Tweet Analysis
- **AI Virality Score**: GPT-4o provides a separate virality score (0-100)
- **Content Analysis**: Detailed breakdown of emotional impact, engagement potential, clarity, and trending relevance
- **Key Insights**: 3-5 specific insights about your tweet's viral potential
- **Improvement Areas**: 2-4 actionable areas for improvement

### Advanced Suggestions
- **Multiple Versions**: 3 different optimized versions of your tweet
- **Reasoning**: Detailed explanations for each suggestion
- **Alternative Approaches**: Different conceptual approaches to your topic
- **Smart Hashtags**: Categorized hashtag suggestions (trending, niche, engagement)

### Visual Enhancements
- **Purple-themed GPT-4o sections** to distinguish AI-enhanced features
- **Progress bars** for content analysis metrics
- **Badge indicators** showing GPT-4o-powered features
- **Enhanced UI** with better organization of suggestions

## 🔧 How It Works

### Analysis Flow
1. **Standard Analysis**: Your existing Twitter algorithm runs first
2. **GPT-4o Enhancement**: If API key is configured, GPT-4o provides additional analysis
3. **Fallback Handling**: If GPT-4o fails, the app continues with standard analysis
4. **Combined Results**: Both analyses are displayed side by side

### Suggestion Generation
1. **Standard Suggestions**: Basic rule-based improvements
2. **GPT-4o Versions**: Advanced AI-generated alternatives
3. **Hashtag Optimization**: Smart hashtag recommendations
4. **Alternative Approaches**: Different ways to present your content

## 🛠️ Configuration Options

### Temperature Settings
- **Analysis Temperature**: 0.3 (more focused, consistent analysis)
- **Suggestions Temperature**: 0.7 (more creative, varied suggestions)

### Model Selection
Currently using `openai/gpt-4o` via OpenRouter. You can modify this in `lib/openrouter-service.ts`:

```typescript
// In the makeRequest calls, change the model parameter
model: 'openai/gpt-4o' // or 'openai/gpt-4o-mini' for faster/cheaper responses
```

## 📊 API Usage Monitoring

The integration includes usage tracking. Check your OpenRouter dashboard to monitor:
- API calls made
- Tokens consumed
- Costs incurred
- Rate limits

## 🔒 Security & Best Practices

### API Key Security
- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly
- ✅ Monitor usage for unexpected spikes

### Error Handling
- ✅ Graceful fallback to standard analysis if GPT-4o fails
- ✅ Detailed error logging for debugging
- ✅ User-friendly error messages
- ✅ No sensitive data in error logs

## 🧪 Testing the Integration

### Test Tweet Analysis
1. Go to the Tweet Analyzer
2. Enter a test tweet
3. Look for the purple "AI-Enhanced Analysis" section
4. Verify GPT-4o insights and suggestions appear

### Test Tweet Composer
1. Go to the Tweet Composer
2. Enter a tweet and click "Generate Suggestions"
3. Look for "AI-Enhanced Versions" section
4. Check hashtag suggestions and alternative approaches

### Verify Fallback
1. Temporarily remove or invalidate your API key
2. Test the same functionality
3. Ensure standard analysis still works
4. Restore API key

## 🐛 Troubleshooting

### Common Issues

**"GPT-4o not configured" message**
- Check that `OPENROUTER_API_KEY` is set in `.env.local`
- Restart your development server
- Verify the API key is valid

**"OpenRouter API error" messages**
- Check your API key is correct
- Verify you have credits in your OpenRouter account
- Check rate limits in your OpenRouter dashboard

**Missing GPT-4o sections in UI**
- Ensure the API key is configured
- Check browser console for errors
- Verify the API calls are succeeding

### Debug Mode
Add this to your `.env.local` for detailed logging:

```bash
DEBUG_GPT4O=true
```

## 💰 Cost Considerations

### OpenRouter Pricing
- GPT-4o: ~$0.0025 per 1K input tokens, ~$0.01 per 1K output tokens
- Typical analysis: ~500-1000 tokens per request
- Estimated cost: $0.01-0.02 per tweet analysis

### Optimization Tips
- Use `gpt-4o-mini` for faster/cheaper responses
- Implement caching for repeated analyses
- Add rate limiting for production use
- Monitor usage in OpenRouter dashboard

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
```bash
OPENROUTER_API_KEY="your-production-api-key"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Rate Limiting
Consider implementing rate limiting for production:
```typescript
// Add to your API routes
const rateLimit = new Map()
// Implement rate limiting logic
```

### Monitoring
- Set up alerts for API failures
- Monitor token usage and costs
- Track user engagement with GPT-4o features

## 📈 Future Enhancements

Potential improvements you could add:
- **Caching**: Store GPT-4o responses to reduce API calls
- **A/B Testing**: Compare standard vs GPT-4o suggestions
- **User Preferences**: Let users choose analysis depth
- **Batch Processing**: Analyze multiple tweets at once
- **Custom Prompts**: Allow users to customize analysis focus

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review OpenRouter documentation
3. Check your API key and credits
4. Verify environment variables are set correctly

---

**Happy tweeting with AI! 🐦✨**
