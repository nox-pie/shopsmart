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

variable "ecs_task_execution_role_arn" {
  type        = string
  description = "IAM role ARN for ECS task execution (trust ecs-tasks.amazonaws.com + AmazonECSTaskExecutionRolePolicy). Set via GitHub secret ECS_TASK_EXECUTION_ROLE_ARN or TF_VAR_ecs_task_execution_role_arn."
  default     = ""

  validation {
    condition = (
      trimspace(var.ecs_task_execution_role_arn) == "" ||
      startswith(var.ecs_task_execution_role_arn, "arn:aws:iam::")
    )
    error_message = "ecs_task_execution_role_arn must be empty or a valid IAM role ARN (arn:aws:iam::...)."
  }
}

