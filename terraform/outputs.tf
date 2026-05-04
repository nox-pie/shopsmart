output "s3_bucket_id" {
  description = "Versioned, encrypted S3 bucket (public access blocked)."
  value       = aws_s3_bucket.artifacts.id
}

output "ecr_repository_url" {
  description = "ECR repository URL (no tag) for docker tag/push."
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs_tasks.id
}
