#!/bin/bash
set -e

echo "🚀 Starting Next.js development server..."

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

exec npm run dev
