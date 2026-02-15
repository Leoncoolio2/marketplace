#!/bin/bash

set -e

FILE="ai-control/TASK_REGISTRY.json"

echo "Reading task registry..."

TASK=$(jq -r '.tasks[] | select(.status=="pending") | .id' $FILE | head -n 1)

if [ -z "$TASK" ]; then
  echo "No pending tasks."
  exit 0
fi

DESCRIPTION=$(jq -r ".tasks[] | select(.id==\"$TASK\") | .description" $FILE)

if [ "$DESCRIPTION" == "null" ]; then
  echo "Task $TASK has no description. Aborting."
  exit 1
fi

echo "Next task: $TASK"
echo "Description: $DESCRIPTION"

tmp=$(mktemp)
jq "(.tasks[] | select(.id==\"$TASK\") | .status) = \"in_progress\"" $FILE > "$tmp"
mv "$tmp" $FILE

./scripts/ai-runner.sh "$DESCRIPTION"
