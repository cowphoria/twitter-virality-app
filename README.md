# 🐦 Twitter Virality App

A powerful Next.js application that analyzes tweets and provides AI-enhanced suggestions to maximize virality using GPT-4o and Twitter's algorithm insights.

## ✨ Features

### 🧠 **AI-Powered Analysis**
- **GPT-4o Integration**: Advanced tweet analysis using OpenRouter's GPT-4o model
- **Content Analysis**: Emotional impact, engagement potential, clarity scoring
- **Trending Relevance**: Real-time trending topic integration
- **Detailed Insights**: Comprehensive breakdown of tweet performance factors

### 🚀 **Enhanced Suggestions**
- **Multiple Tweet Versions**: AI-generated improved versions with reasoning
- **Alternative Approaches**: Different conceptual ideas for your content
- **Hashtag Suggestions**: Categorized hashtags (trending, niche, engagement)
- **Character Count**: Real-time character counting for optimal tweet length

### 📊 **Virality Scoring**
- **Dual Algorithm**: Combines Twitter's algorithm insights with GPT-4o analysis
- **Multi-Factor Analysis**: Engagement, timing, content, hashtags, mentions
- **Score Comparison**: Before/after analysis with expected improvements
- **Visual Progress Bars**: Easy-to-understand scoring visualization

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Beautiful theme switching
- **Real-time Analysis**: Instant feedback as you type
- **Copy & Use Features**: One-click copying and implementation of suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: OpenRouter GPT-4o API
- **Authentication**: NextAuth.js with Google OAuth
- **Backend**: Python Twitter Algorithm Service
- **Database**: Ready for PostgreSQL integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd twitter-virality-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENROUTER_API_KEY="sk-or-your-api-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Setup Guides

- **[GPT-4o Setup Guide](GPT4O_SETUP_GUIDE.md)** - Complete OpenRouter integration guide
- **[Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)** - Authentication configuration
- **[How to Run](HOW_TO_RUN.md)** - Detailed running instructions
- **[Integration Guide](INTEGRATION_README.md)** - System integration details

## 🎯 How It Works

### 1. **Tweet Analysis**
- Enter your tweet text in the analyzer
- Get instant virality scoring from multiple algorithms
- View detailed breakdown of engagement factors

### 2. **AI Enhancement**
- GPT-4o analyzes your content for improvement opportunities
- Receive multiple optimized versions with explanations
- Get alternative approaches and hashtag suggestions

### 3. **Implementation**
- Copy suggested tweets with one click
- Use the "Use This" button to replace your current text
- Track character count and engagement potential

## 🔧 API Endpoints

- `POST /api/analyze-tweet` - Analyze tweet content and get suggestions
- `POST /api/suggest-improvements` - Generate enhanced tweet versions
- `GET /api/auth/[...nextauth]` - Authentication endpoints

## 📁 Project Structure

```
twitter-virality-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── landing/           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── tweet-analyzer.tsx # Main analysis component
│   └── tweet-composer.tsx # Tweet composition component
├── lib/                   # Utility libraries
│   ├── openrouter-service.ts # GPT-4o integration
│   └── twitter-algorithm-bridge.ts # Algorithm bridge
├── python/               # Python algorithm service
└── public/               # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Twitter Algorithm**: Based on insights from Twitter's open-source algorithm
- **OpenRouter**: For providing access to GPT-4o
- **shadcn/ui**: For the beautiful component library
- **Next.js Team**: For the amazing framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/twitter-virality-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/twitter-virality-app/discussions)
- **Email**: your-email@example.com

---

**Made with ❤️ for the Twitter community**
