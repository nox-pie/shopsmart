#!/bin/bash

KEY_NAME="vockey"
SG_NAME="launch-wizard-1"
INSTANCE_NAME="Terminal-EC2"

# 1. Key Pair
echo "Checking key pair..."
if aws ec2 describe-key-pairs --key-names "$KEY_NAME" >/dev/null 2>&1; then
  echo "Key pair '$KEY_NAME' already exists. Skipping creation."
else
  echo "Creating key pair..."
  aws ec2 create-key-pair \
    --key-name "$KEY_NAME" \
    --query "KeyMaterial" \
    --output text > "${KEY_NAME}.pem"
  chmod 400 "${KEY_NAME}.pem"
fi

# 2. VPC Context
echo "Getting default VPC..."
VPC_ID=$(aws ec2 describe-vpcs \
  --filters Name=isDefault,Values=true \
  --query "Vpcs[0].VpcId" \
  --output text)

# 3. Security Group
echo "Checking security group..."
SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$VPC_ID" \
  --query "SecurityGroups[0].GroupId" \
  --output text)

if [ "$SG_ID" != "None" ] && [ -n "$SG_ID" ]; then
  echo "Security group '$SG_NAME' already exists (ID: $SG_ID). Skipping creation."
else
  echo "Creating security group..."
  SG_ID=$(aws ec2 create-security-group \
    --group-name "$SG_NAME" \
    --description "Allow SSH" \
    --vpc-id "$VPC_ID" \
    --query "GroupId" \
    --output text)
  
  echo "Allowing SSH access..."
  aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0
fi

# 4. AMI and Instance
echo "Fetching latest Amazon Linux AMI..."
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-*-x86_64" \
  --query "Images | sort_by(@, &CreationDate)[-1].ImageId" \
  --output text)

echo "Checking for existing running instance with name '$INSTANCE_NAME'..."
EXISTING_INSTANCE=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=$INSTANCE_NAME" "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --output text)

if [ "$EXISTING_INSTANCE" != "None" ] && [ -n "$EXISTING_INSTANCE" ]; then
  INSTANCE_ID=$EXISTING_INSTANCE
  echo "An instance with name '$INSTANCE_NAME' is already running (ID: $INSTANCE_ID)."
else
  echo "Launching new EC2 instance safely..."
  INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --instance-type t3.micro \
    --key-name "$KEY_NAME" \
    --security-group-ids "$SG_ID" \
    --associate-public-ip-address \
    --count 1 \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --query "Instances[0].InstanceId" \
    --output text)
  
  echo "Waiting for instance to start..."
  aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
fi

PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

echo ""
echo "INSTANCE READY"
echo "Public IP: $PUBLIC_IP"
echo "SSH using:"
echo "ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
