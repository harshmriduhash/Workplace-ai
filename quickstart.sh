#!/bin/bash
# Quick Start Script for Workplace-AI MVP

echo "🚀 Workplace-AI MVP - Quick Start"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install
cd ../frontend
npm install
cd ..

echo ""
echo "✅ Dependencies installed!"
echo ""

# Database setup
echo "📊 Setting up database..."
echo "Make sure PostgreSQL is running locally"
echo "Then run: createdb workplace_ai"
echo ""

# Instructions
echo "🎯 To start development:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "📚 Full deployment guide: see DEPLOYMENT.md"
echo "🎤 Investor demo script: see INVESTOR_DEMO.md"
echo ""
