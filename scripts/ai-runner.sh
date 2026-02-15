#!/bin/bash

set -e

AGENT="leonadmin-leon-marketplace-dev"
TASK_MESSAGE="$1"

if [ -z "$TASK_MESSAGE" ]; then
  echo "Usage: ./scripts/ai-runner.sh \"Your task description\""
  exit 1
fi

BRANCH="ai/$(date +%Y%m%d%H%M%S)"

echo "Creating branch $BRANCH"
git checkout -b $BRANCH

echo "Running AI task..."
openclaw agent --local --agent $AGENT --message "$TASK_MESSAGE"

echo "Installing backend deps..."
cd backend
npm install >/dev/null 2>&1 || true
npx prisma generate >/dev/null 2>&1 || true

echo "Building backend..."
npm run build

cd ..

echo "Committing changes..."
git add .
git commit -m "feat(ai): $TASK_MESSAGE"

echo "Pushing branch..."
git push origin $BRANCH

echo "Done. Branch pushed: $BRANCH"
