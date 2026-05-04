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
  description = "Whether to provision ECS resources (cluster, task, service, ECR, logs, SG). Set false in restricted learner accounts."
  default     = true
}

variable "ecs_lab_role_name" {
  type        = string
  description = "Pre-existing IAM role name to use for ECS task execution in learner accounts (for example, LabRole)."
  default     = "LabRole"
}

variable "ecs_task_execution_role_arn" {
  type        = string
  description = "Optional explicit IAM role ARN for ECS task execution. If empty, Terraform looks up ecs_lab_role_name."
  default     = ""

  validation {
    condition = (
      trimspace(var.ecs_task_execution_role_arn) == "" ||
      startswith(var.ecs_task_execution_role_arn, "arn:aws:iam::")
    )
    error_message = "ecs_task_execution_role_arn must be empty or a valid IAM role ARN (arn:aws:iam::...)."
  }
}

