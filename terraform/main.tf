# ============================================================
# ShopSmart — Terraform root module (aligned with sai reference layout)
# ============================================================
#
# Module layout:
#   locals.tf       — provision_s3 / provision_ecs flags (skip_aws_creates for labs)
#   providers.tf    — AWS provider
#   versions.tf     — versions + optional S3 backend (configured in CI via -backend-config)
#   variables.tf    — inputs
#   s3.tf           — S3 artifacts bucket (rubric)
#   vpc.tf          — VPC + public subnets (ECS)
#   ecs.tf          — ECR, ALB, ECS Fargate
#   outputs.tf      — outputs for CI (ECR URL, ECS names, ALB DNS)
#
# Remote state (same idea as sai): GitHub Actions can set secret TF_STATE_BUCKET and bootstrap
# the bucket before terraform init. Without TF_STATE_BUCKET, CI uses local state + Actions cache.
#
# Important: explicit IAM denies (e.g. Vocareum voc-cancel-cred) block CreateBucket/CreateVpc/etc.
# regardless of Terraform syntax—requests match sai only when credentials allow the same APIs.
#
# Usage:
#   terraform init | terraform validate | terraform plan -out=tfplan | terraform apply tfplan
#
# ============================================================
