#!/bin/bash

# Twitter Virality App Integration Setup Script
# This script sets up the integration between the frontend and Twitter algorithm

set -e

echo "🚀 Setting up Twitter Virality App Integration..."
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if the-algorithm-main directory exists
if [ ! -d "the-algorithm-main" ]; then
    echo "❌ Error: the-algorithm-main directory not found"
    echo "Please ensure the Twitter algorithm is in the the-algorithm-main directory"
    exit 1
fi

echo "✅ Project structure verified"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd python
if [ -f "requirements.txt" ]; then
    python3 -m pip install -r requirements.txt
else
    echo "⚠️  Warning: requirements.txt not found, installing basic dependencies..."
    python3 -m pip install numpy pandas scikit-learn
fi
cd ..

# Make Python script executable
chmod +x python/twitter_algorithm_service.py

# Make test script executable
chmod +x scripts/test-integration.js

echo "✅ Python dependencies installed"

# Test Python service
echo "🧪 Testing Python Twitter Algorithm Service..."
cd python
if python3 twitter_algorithm_service.py "Test tweet for integration" > /dev/null 2>&1; then
    echo "✅ Python service test passed"
else
    echo "⚠️  Warning: Python service test failed, but continuing..."
fi
cd ..

# Create .env file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Twitter Virality App Configuration
NEXT_PUBLIC_APP_NAME="Twitter Virality Analyzer"
NEXT_PUBLIC_ALGORITHM_VERSION="twitter-algorithm-v1.0"

# Algorithm Configuration
TWITTER_ALGORITHM_PATH="./the-algorithm-main/the-algorithm-main"
PYTHON_SERVICE_PATH="./python/twitter_algorithm_service.py"

# Optional: Add your own configuration here
EOF
    echo "✅ .env.local file created"
fi

echo ""
echo "🎉 Integration setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Test the integration with 'node scripts/test-integration.js'"
echo ""
echo "🔧 Available commands:"
echo "- npm run dev          # Start development server"
echo "- npm run build        # Build for production"
echo "- node scripts/test-integration.js  # Run integration tests"
echo ""
echo "📚 Documentation:"
echo "- Frontend: Next.js with TypeScript"
echo "- Algorithm Bridge: lib/twitter-algorithm-bridge.ts"
echo "- Python Service: python/twitter_algorithm_service.py"
echo "- Twitter Algorithm: the-algorithm-main/the-algorithm-main/"
echo ""
echo "Happy coding! 🚀"
