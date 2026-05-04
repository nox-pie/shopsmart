#!/bin/bash

# Instance: set EC2_INSTANCE_ID or pass as second argument (after start|stop).
INSTANCE_ID="${EC2_INSTANCE_ID:-${2:-}}"

if [ -z "$1" ]; then
  echo "Usage: EC2_INSTANCE_ID=i-... $0 start|stop   OR   $0 start|stop [instance_id]"
  exit 1
fi

if [ -z "$INSTANCE_ID" ]; then
  echo "Missing instance id. Set EC2_INSTANCE_ID or pass: $0 $1 <instance_id>"
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
