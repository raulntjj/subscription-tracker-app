#!/bin/bash
set -e

echo "Starting Next.js development server..."

# Verifica se node_modules existe e se next está instalado
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

exec npm run dev
