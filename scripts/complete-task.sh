#!/usr/bin/env bash

set -e

TASK_ID=$1

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/complete-task.sh <task-id>"
  exit 1
fi

REGISTRY="ai-control/TASK_REGISTRY.json"

echo "Marking $TASK_ID as completed..."

jq --arg id "$TASK_ID" '
  .tasks = (.tasks | map(
    if .id==$id then .status="completed" else . end
  ))
' "$REGISTRY" > tmp.json && mv tmp.json "$REGISTRY"

git add "$REGISTRY"
git commit -m "chore: mark $TASK_ID as completed"
git push

echo "Task $TASK_ID completed."
