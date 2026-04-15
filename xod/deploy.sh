#!/bin/bash

# XOD Financial Advisor System - Deployment Script
# This script helps with the deployment process

echo "🚀 XOD Financial Advisor System - Deployment Helper"
echo "=================================================="

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting."; exit 1; }

echo "✅ Prerequisites check passed"

# Build frontend for production
echo "📦 Building frontend for production..."
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

echo ""
echo "🎯 Deployment Checklist:"
echo "========================"
echo "1. 📦 Push this code to your GitHub repository"
echo "2. 🗄️  Create Supabase project and note connection details"
echo "3. 🔧 Deploy backend to Render:"
echo "   - Repository: your-github-repo"
echo "   - Root directory: backend"
echo "   - Environment: Docker"
echo "   - Set environment variables from backend/.env.example"
echo "4. 🌐 Deploy frontend to Vercel:"
echo "   - Repository: your-github-repo"
echo "   - Root directory: frontend"
echo "   - Environment variable: VITE_API_BASE_URL=https://your-render-backend-url"
echo "5. 🔒 Update backend CORS settings with Vercel URL"
echo ""
echo "📋 Default login credentials:"
echo "   Email: advisor@xod.local"
echo "   Password: password"
echo ""
echo "🎉 Ready for deployment!"