# LinkSaver Deployment Script for Windows
Write-Host "🚀 LinkSaver Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Run: git init" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Check for environment variables
Write-Host "🔍 Checking environment variables..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found. Make sure you have your environment variables set up." -ForegroundColor Yellow
}

# Commit changes
Write-Host "📝 Committing changes..." -ForegroundColor Yellow
git add .
$commitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

Write-Host "🎉 Ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host "2. Deploy to Vercel: npx vercel" -ForegroundColor White
Write-Host "3. Or visit https://vercel.com to deploy via dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Environment variables to set in Vercel:" -ForegroundColor Cyan
Write-Host "- NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor White
Write-Host "- NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "- JINA_API_KEY" -ForegroundColor White
