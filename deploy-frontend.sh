#!/usr/bin/env bash
set -e

# Deploy QuoteSnap frontend to Vercel
# Usage:
#   export VERCEL_TOKEN=<your-vercel-token>
#   ./deploy-frontend.sh

if [ -z "$VERCEL_TOKEN" ]; then
  echo "ERROR: Set VERCEL_TOKEN first. Get one at https://vercel.com/account/tokens"
  exit 1
fi

cd "$(dirname "$0")/frontend"

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
  echo "WARNING: NEXT_PUBLIC_API_URL is not set. The frontend will fall back to http://localhost:8341"
fi

echo "Deploying QuoteSnap frontend to Vercel..."
npx vercel --token "$VERCEL_TOKEN" --prod --yes

echo ""
echo "If this is the first deploy, set the API URL with:"
echo "  npx vercel --token \$VERCEL_TOKEN env add NEXT_PUBLIC_API_URL"
