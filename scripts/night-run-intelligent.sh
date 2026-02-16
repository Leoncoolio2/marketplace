#!/bin/bash

set -e

WORKDIR="/home/leonadmin/marketplace-dev"
cd "$WORKDIR"

MAX_HOURS=6
END_TIME=$((SECONDS + MAX_HOURS*3600))

echo "Starting intelligent autonomous development loop..."

while [ $SECONDS -lt $END_TIME ]; do

  echo "-------------------------------------------"
  echo "Checking for open AI PR..."
  echo "-------------------------------------------"

  OPEN_PR=$(gh pr list --state open --json number,headRefName \
            --jq '.[] | select(.headRefName | startswith("ai/")) | .number' | head -n 1)

  if [ -n "$OPEN_PR" ]; then
      echo "Open AI PR detected: #$OPEN_PR"
      echo "Checking CI status..."

      STATUS=$(gh pr view "$OPEN_PR" --json statusCheckRollup \
              --jq '.statusCheckRollup[]?.conclusion' 2>/dev/null | sort -u)

      if echo "$STATUS" | grep -q "FAILURE"; then
          echo "CI failed. Waiting for manual fix."
          sleep 300
          continue
      fi

      if echo "$STATUS" | grep -q "SUCCESS"; then
          echo "CI passed. Waiting for merge..."
          sleep 120
          continue
      fi

      echo "CI still running..."
      sleep 120
      continue
  fi

  echo "No open AI PR found."
  echo "Running next task..."

  ./scripts/run-next-task.sh || true

  echo "Sleeping 120 seconds..."
  sleep 120

done

echo "Night session finished."
