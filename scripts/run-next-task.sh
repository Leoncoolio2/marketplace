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

# Mark task as in_progress
tmp=$(mktemp)
jq "(.tasks[] | select(.id==\"$TASK\") | .status) = \"in_progress\"" $FILE > "$tmp"
mv "$tmp" $FILE

./scripts/ai-runner.sh "$DESCRIPTION"
