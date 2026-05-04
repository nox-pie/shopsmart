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

variable "ecs_task_execution_role_name" {
  type        = string
  description = "Name of an existing IAM role for ECS task execution (no CreateRole in Terraform). In AWS Academy, use a role your lab already has, or create ecsTaskExecutionRole once via console if policy allows. Default: ecsTaskExecutionRole."
  default     = "ecsTaskExecutionRole"
}

