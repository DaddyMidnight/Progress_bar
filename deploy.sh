#!/bin/bash

# Virtual Object Placer - Deployment Script
# This script helps deploy the application to various platforms

echo "🚀 Virtual Object Placer - Deployment Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "⚠️  Vercel CLI not found. Install it with: npm i -g vercel"
    echo "📁 Build files are ready in the 'build' directory"
    echo "   You can manually deploy to:"
    echo "   - Netlify: Drag and drop the 'build' folder"
    echo "   - Vercel: Install CLI and run 'vercel --prod'"
    echo "   - GitHub Pages: Push to gh-pages branch"
fi

echo "🎉 Deployment script completed!"