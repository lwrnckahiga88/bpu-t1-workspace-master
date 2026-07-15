#!/bin/bash
# BPU-T1 Federated Runtime Deployment Script
# Version: 1.1.0

set -e
echo "🚀 Starting BPU-T1 Deployment..."

# 1. Environment Check
echo "🔍 Checking environment..."
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed."
    exit 1
fi

# 2. Directory Setup
echo "📁 Setting up directories..."
mkdir -p dist/adapters

# 3. Consolidate Main Runtime
echo "📦 Consolidating Runtime..."
cp runtime/index.html dist/index.html
cp DOCUMENTATION.md dist/DOCUMENTATION.md

# 4. Copy Adapters
echo "🔌 Preparing Adapter Layer..."
cp -r adapters/* dist/adapters/

# 5. Finalize
echo "✅ Deployment prepared in /dist directory."
echo "🌐 You can now host the content of /dist on any static web server."
