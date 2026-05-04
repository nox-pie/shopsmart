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
