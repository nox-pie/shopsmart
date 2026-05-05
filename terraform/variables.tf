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

variable "enable_ecs" {
  type        = bool
  description = "Provision VPC, ALB, ECR, and ECS Fargate (Phase 3 rubric). Set false only for S3-only applies."
  default     = true
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR for the VPC created when enable_ecs is true."
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
