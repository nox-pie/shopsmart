#!/bin/bash

# Configuration
INSTANCE_ID=${1:-"i-0e54c628a35a0cd63"} # Allow passing instance ID via args, defaulting to fallback

STATE=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[0].Instances[0].State.Name" \
  --output text)

STATUS_JSON=$(aws ec2 describe-instance-status \
  --instance-ids "$INSTANCE_ID" \
  --output json)

SYSTEM_STATUS=$(echo "$STATUS_JSON" | jq -r '.InstanceStatuses[0].SystemStatus.Status // "insufficient-data"')
INSTANCE_STATUS=$(echo "$STATUS_JSON" | jq -r '.InstanceStatuses[0].InstanceStatus.Status // "insufficient-data"')

if [ "$STATE" != "running" ]; then
  HEALTH="[INFO] Instance Not Running"
elif [ "$SYSTEM_STATUS" = "ok" ] && [ "$INSTANCE_STATUS" = "ok" ]; then
  HEALTH="[OK] System Healthy"
elif [ "$SYSTEM_STATUS" = "initializing" ] || [ "$INSTANCE_STATUS" = "initializing" ]; then
  HEALTH="[WARN] Initializing"
else
  HEALTH="[ALERT] Check System!"
fi

echo
echo "EC2 Health Check Summary"
echo "------------------------"
printf "%-18s %s\n" "Instance ID:" "$INSTANCE_ID"
printf "%-18s %s\n" "State:" "$STATE"
printf "%-18s %s\n" "System Status:" "$SYSTEM_STATUS"
printf "%-18s %s\n" "Instance Status:" "$INSTANCE_STATUS"
printf "%-18s %s\n" "Health:" "$HEALTH"
echo
