#!/usr/bin/env bash
# ==============================================================================
# SIKO Eduventures — 1-Click Production Server Deployment Script
# Usage: chmod +x deploy.sh && ./deploy.sh
# ==============================================================================

set -e

echo "=================================================="
echo "🚀 Deploying SIKO Eduventures Production App"
echo "=================================================="

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker compose not found. Installing compose plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# Copy production env if not existing
if [ ! -f .env ]; then
    echo "📝 Copying .env.production to .env..."
    cp .env.production .env
    echo "⚠️ NOTE: Please edit .env with your live RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET."
fi

# Build and start services
echo "🔨 Building Docker containers..."
docker compose down || true
docker compose build --no-cache
docker compose up -d

echo "⏳ Waiting for health check..."
sleep 5

docker compose ps

echo "=================================================="
echo "✅ SIKO Production App is LIVE & Operational 24/7!"
echo "   - Web App & REST API: http://$(curl -s ifconfig.me || echo 'localhost')"
echo "   - Interactive Docs:   http://$(curl -s ifconfig.me || echo 'localhost')/docs"
echo "   - Health Endpoint:    http://$(curl -s ifconfig.me || echo 'localhost')/health"
echo "=================================================="
