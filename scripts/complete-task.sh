#!/bin/bash

set -e

FILE="ai-control/TASK_REGISTRY.json"
TASK="$1"

if [ -z "$TASK" ]; then
  echo "Usage: ./complete-task.sh task-id"
  exit 1
fi

tmp=$(mktemp)
jq "(.tasks[] | select(.id==\"$TASK\") | .status) = \"completed\"" $FILE > "$tmp"
mv "$tmp" $FILE

git add $FILE
git commit -m "chore(task): mark $TASK as completed"
git push

echo "Task $TASK marked as completed."
