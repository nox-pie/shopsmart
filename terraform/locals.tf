# Combined switches — Vocareum/LabRole policies (e.g. voc-cancel-cred) often deny creating
# S3 buckets, VPCs, ECR repos, CloudWatch log groups, and ECS clusters. Set
# skip_aws_creates=true so terraform validate/plan/apply succeed without any AWS API creates.
locals {
  provision_s3  = var.enable_s3 && !var.skip_aws_creates
  provision_ecs = var.enable_ecs && !var.skip_aws_creates
}
