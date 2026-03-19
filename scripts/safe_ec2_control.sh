#!/bin/bash

INSTANCE_ID=${2:-"i-0e54c628a35a0cd63"}

if [ -z "$1" ]; then
  echo "Usage: $0 start|stop [instance_id]"
  exit 1
fi

STATE=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[0].Instances[0].State.Name" \
  --output text)

if [ "$1" = "start" ]; then
  if [ "$STATE" = "running" ]; then
    echo "Instance $INSTANCE_ID is already running. Exiting safely."
    exit 0
  fi

  if [ "$STATE" = "stopped" ]; then
    echo "Starting instance $INSTANCE_ID..."
    aws ec2 start-instances --instance-ids "$INSTANCE_ID" >/dev/null
    echo "Start command issued."
    exit 0
  fi

  echo "Instance is in state '$STATE'. Cannot start now."
  exit 1
fi

if [ "$1" = "stop" ]; then
  if [ "$STATE" = "stopped" ]; then
    echo "Instance $INSTANCE_ID is already stopped. Exiting safely."
    exit 0
  fi

  if [ "$STATE" = "running" ]; then
    echo "Stopping instance $INSTANCE_ID..."
    aws ec2 stop-instances --instance-ids "$INSTANCE_ID" >/dev/null
    echo "Stop command issued."
    exit 0
  fi

  echo "Instance is in state '$STATE'. Cannot stop now."
  exit 1
fi

echo "Invalid command: $1"
echo "Usage: $0 start|stop [instance_id]"
exit 1
