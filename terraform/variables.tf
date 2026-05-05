variable "aws_region" {
  type        = string
  description = "AWS region for all resources (must match GitHub Actions AWS_REGION secret)."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Short prefix for resource names (lowercase, no spaces)."
  default     = "shopsmart"
}

variable "environment" {
  type        = string
  description = "Tag value for Environment (sai-style default_tags)."
  default     = "production"
}

# Optional fixed bucket name (sai uses var.s3_bucket_name in s3.tf). Empty = random suffix.
variable "s3_bucket_name" {
  type        = string
  description = "If non-empty, use this global S3 bucket name for artifacts. If empty, name is shopsmart-artifacts-<random>."
  default     = ""
}

variable "enable_s3" {
  type        = bool
  description = "Provision the S3 artifacts bucket and related settings (rubric Phase 2)."
  default     = true
}

variable "enable_ecs" {
  type        = bool
  description = "Provision VPC, ALB, ECR, and ECS Fargate (rubric Phase 3)."
  default     = true
}

variable "skip_aws_creates" {
  type        = bool
  description = "If true, no AWS resources are created (for accounts where voc-cancel-cred or similar denies S3/EC2/ECR/ECS creates). CI: set repository variable SKIP_AWS_CREATES=true."
  default     = false
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR for the VPC when ECS stack is provisioned (enable_ecs and not skip_aws_creates)."
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "AZs for public subnets (minimum 2 for ALB)."
  default     = ["us-east-1a", "us-east-1b"]
}

variable "ecs_lab_role_name" {
  type        = string
  description = "Pre-existing IAM role name for ECS task and execution role (e.g. LabRole)."
  default     = "LabRole"
}

# sai ecs.tf uses data.aws_iam_role.lab_role — enable only if iam:GetRole is allowed.
variable "ecs_use_iam_role_lookup" {
  type        = bool
  description = "If true, resolve LabRole via data.aws_iam_role (same as sai). If false, use STS ARN (works when GetRole is denied)."
  default     = false
}

variable "ecs_task_execution_role_arn" {
  type        = string
  description = "Optional explicit IAM role ARN. If empty, uses arn:aws:iam::<account>:role/<ecs_lab_role_name>."
  default     = ""

  validation {
    condition = (
      trimspace(var.ecs_task_execution_role_arn) == "" ||
      startswith(var.ecs_task_execution_role_arn, "arn:aws:iam::")
    )
    error_message = "ecs_task_execution_role_arn must be empty or a valid IAM role ARN (arn:aws:iam::...)."
  }
}
