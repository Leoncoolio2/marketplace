#!/usr/bin/env bash

set -e

REGISTRY="ai-control/TASK_REGISTRY.json"

echo "Reading task registry..."

TASK_ID=$(jq -r '
  .tasks as $tasks
  | $tasks[]
  | select(.status=="pending")
  | select(
      (.dependencies | length == 0)
      or
      (all(.dependencies[]; 
          ($tasks[] | select(.id==.) | .status) == "completed"
      ))
    )
  | .id
' "$REGISTRY" | head -n 1)

if [ -z "$TASK_ID" ]; then
  echo "No pending tasks found."
  exit 0
fi

echo "Next task: $TASK_ID"

echo "Updating status to in_progress..."

jq --arg id "$TASK_ID" '
  .tasks = (.tasks | map(
    if .id==$id then .status="in_progress" else . end
  ))
' "$REGISTRY" > tmp.json && mv tmp.json "$REGISTRY"

git add "$REGISTRY"
git commit -m "chore: set $TASK_ID to in_progress"

echo "Creating branch..."

git checkout -b "feature/$TASK_ID"

echo "Branch feature/$TASK_ID created."
echo ""
echo "Now implement the task using AI and commit changes."
echo "After CI passes, run: ./scripts/complete-task.sh $TASK_ID"
