#!/bin/bash

set -e

WORKDIR="/home/leonadmin/marketplace-dev"
cd "$WORKDIR"

echo "Starting autonomous development loop..."

MAX_TASKS=5   # piirame et ei läheks lõputuks
COUNT=0

while [ $COUNT -lt $MAX_TASKS ]; do
  echo "---------------------------------"
  echo "Running task iteration $COUNT"
  echo "---------------------------------"

  ./scripts/run-next-task.sh || true

  echo "Sleeping 60 seconds before next iteration..."
  sleep 60

  COUNT=$((COUNT+1))
done

echo "Night run completed."
