#!/bin/bash

echo "🚀 Resume Builder - Quick Start"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✓ Node.js $(node --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Run development server
echo ""
echo "🔧 Starting development server..."
echo ""
echo "📍 Open http://localhost:3000 in your browser"
echo ""

npm run dev
