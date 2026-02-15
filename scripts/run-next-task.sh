#!/bin/bash

set -e

FILE="ai-control/TASK_REGISTRY.json"

TASK=$(jq -r '.tasks[] | select(.status=="pending") | .id' $FILE | head -n 1)
if [ -z "$TASK" ]; then
  echo "No pending tasks."
  exit 0
fi

DESCRIPTION=$(jq -r ".tasks[] | select(.id==\"$TASK\") | .description" $FILE)

echo "Next task: $TASK"
echo "Description: $DESCRIPTION"

# Mark as in_progress
tmp=$(mktemp)
jq "(.tasks[] | select(.id==\"$TASK\") | .status) = \"in_progress\"" $FILE > "$tmp"
mv "$tmp" $FILE

./scripts/ai-runner.sh "$DESCRIPTION"

' "$REGISTRY" > tmp.json && mv tmp.json "$REGISTRY"

git add "$REGISTRY"
git commit -m "chore: set $TASK_ID to in_progress"

echo "Creating branch..."

git checkout -b "feature/$TASK_ID"

echo "Branch feature/$TASK_ID created."
echo ""
echo "Now implement the task using AI and commit changes."
echo "After CI passes, run: ./scripts/complete-task.sh $TASK_ID"
