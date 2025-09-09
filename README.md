# 🐦 Twitter Virality App

A powerful Next.js application that analyzes tweets and provides AI-enhanced suggestions to maximize virality using GPT-4o and Twitter's algorithm insights.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/cowphoria/twitter-virality-app.git
cd twitter-virality-app

# Install dependencies
npm install

# Set up environment variables
cp config/env.example .env.local

# Start the development server
npm run dev
```

## 📖 Documentation

- **[Complete Setup Guide](docs/README.md)** - Full installation and configuration
- **[GPT-4o Setup](docs/GPT4O_SETUP_GUIDE.md)** - OpenRouter integration guide
- **[Google OAuth Setup](docs/GOOGLE_OAUTH_SETUP.md)** - Authentication configuration
- **[How to Run](docs/HOW_TO_RUN.md)** - Detailed running instructions
- **[Integration Guide](docs/INTEGRATION_README.md)** - System integration details

## ✨ Features

- 🧠 **GPT-4o Integration** - Advanced AI analysis and suggestions
- 📊 **Virality Scoring** - Multi-factor tweet analysis
- 🎨 **Modern UI** - Beautiful responsive design with dark/light mode
- 🔐 **Authentication** - Google OAuth integration
- 📈 **Real-time Analysis** - Instant feedback and improvements

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: OpenRouter GPT-4o API
- **Auth**: NextAuth.js with Google OAuth
- **Backend**: Python Twitter Algorithm Service

## 📁 Project Structure

```
twitter-virality-app/
├── app/                    # Next.js app directory
├── components/            # React components
├── config/               # Configuration files
├── docs/                 # Documentation
├── lib/                  # Utility libraries
├── python/              # Python algorithm service
├── scripts/             # Setup and utility scripts
├── tests/               # Test files
└── public/              # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Import your GitHub repository to Vercel
2. Add environment variables from `config/env.example`
3. Deploy automatically

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/cowphoria/twitter-virality-app/issues)
- **Repository**: [https://github.com/cowphoria/twitter-virality-app](https://github.com/cowphoria/twitter-virality-app)

---

**Made with ❤️ for the Twitter community**
