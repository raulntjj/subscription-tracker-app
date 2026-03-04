#!/bin/bash
set -e

echo "Starting Next.js development server..."

# Verifica instalação de dependencias
if [ -f /app/node_modules/.bin/next ]; then
    echo "Next.js found in node_modules, skipping npm install"
else
    echo "Next.js not found, running npm install..."
    npm install --no-audit --prefer-offline
fi

exec npm run dev
