#!/bin/bash

set -e

WORKDIR="/home/leonadmin/marketplace-dev"
cd "$WORKDIR"

MAX_HOURS=6
END_TIME=$((SECONDS + MAX_HOURS*3600))

echo "Starting FULL autonomous development loop..."

while [ $SECONDS -lt $END_TIME ]; do

  echo "-------------------------------------------"
  echo "Checking for open AI PR..."
  echo "-------------------------------------------"

  OPEN_PR=$(gh pr list --state open --json number,headRefName \
            --jq '.[] | select(.headRefName | startswith("ai/")) | .number' | head -n 1)

  # --------------------------------------------------
  # CASE 1: There is an open PR
  # --------------------------------------------------
  if [ -n "$OPEN_PR" ]; then

      echo "Open AI PR detected: #$OPEN_PR"

      STATUS=$(gh pr view "$OPEN_PR" --json statusCheckRollup \
              --jq '.statusCheckRollup[]?.conclusion' 2>/dev/null | sort -u)

      if echo "$STATUS" | grep -q "FAILURE"; then
          echo "CI FAILED. Stopping autonomous loop."
          exit 1
      fi

      if echo "$STATUS" | grep -q "SUCCESS"; then
          echo "CI passed. Checking merge status..."

          MERGED=$(gh pr view "$OPEN_PR" --json merged --jq '.merged')

          if [ "$MERGED" = "true" ]; then
              echo "PR merged. Completing task..."

              git checkout main
              git pull origin main

              LAST_TASK=$(git log -1 --pretty=%B | grep -o 'task-[^:]*' | head -n 1 | sed 's/task-//')

              if [ -n "$LAST_TASK" ]; then
                  ./scripts/complete-task.sh "$LAST_TASK"
              fi

              sleep 30
              continue
          else
              echo "Waiting for merge..."
              sleep 120
              continue
          fi
      fi

      echo "CI running..."
      sleep 120
      continue
  fi

  # --------------------------------------------------
  # CASE 2: No open PR
  # --------------------------------------------------
  echo "No open AI PR found."
  echo "Running next task..."

  ./scripts/run-next-task.sh || true

  sleep 120

done

echo "Autonomous session finished."
