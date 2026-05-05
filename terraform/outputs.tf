output "s3_bucket_id" {
  description = "Versioned, encrypted S3 bucket (public access blocked)."
  value       = local.provision_s3 ? aws_s3_bucket.artifacts[0].id : ""
}

output "ecr_repository_url" {
  description = "ECR repository URL (no tag) for docker tag/push."
  value       = local.provision_ecs ? aws_ecr_repository.app[0].repository_url : ""
}

output "ecs_cluster_name" {
  value = local.provision_ecs ? aws_ecs_cluster.main[0].name : ""
}

output "ecs_service_name" {
  value = local.provision_ecs ? aws_ecs_service.app[0].name : ""
}

output "ecs_security_group_id" {
  value = local.provision_ecs ? aws_security_group.ecs_tasks[0].id : ""
}

output "alb_dns_name" {
  description = "HTTP endpoint for the app (ALB forwards to the container on port 5001)."
  value       = local.provision_ecs ? aws_lb.main[0].dns_name : ""
}
