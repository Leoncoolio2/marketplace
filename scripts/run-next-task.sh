#!/bin/bash

set -e

FILE="ai-control/TASK_REGISTRY.json"

echo "Reading task registry..."

TASK=""

for id in $(jq -r '.tasks[] | select(.status=="pending") | .id' "$FILE"); do
  deps=$(jq -r ".tasks[] | select(.id==\"$id\") | .dependencies[]" "$FILE" 2>/dev/null)

  runnable=true

  for dep in $deps; do
    status=$(jq -r ".tasks[] | select(.id==\"$dep\") | .status" "$FILE")
    if [ "$status" != "completed" ]; then
      runnable=false
      break
    fi
  done

  if [ "$runnable" = true ]; then
    TASK="$id"
    break
  fi
done

if [ -z "$TASK" ]; then
  echo "No runnable tasks."
  exit 0
fi

DESCRIPTION=$(jq -r ".tasks[] | select(.id==\"$TASK\") | .description" "$FILE")

echo "Next task: $TASK"
echo "Description: $DESCRIPTION"

tmp=$(mktemp)
jq "(.tasks[] | select(.id==\"$TASK\") | .status) = \"in_progress\"" "$FILE" > "$tmp"
mv "$tmp" "$FILE"

./scripts/ai-runner.sh "$DESCRIPTION"
