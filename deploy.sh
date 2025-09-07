#!/bin/bash

# LinkSaver Deployment Script
echo "🚀 LinkSaver Deployment Helper"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check for environment variables
echo "🔍 Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Make sure you have your environment variables set up."
fi

# Commit changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy: $(date)"

echo "🎉 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy to Vercel: npx vercel"
echo "3. Or visit https://vercel.com to deploy via dashboard"
echo ""
echo "Environment variables to set in Vercel:"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY" 
echo "- JINA_API_KEY"
