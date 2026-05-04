# AWS Academy / learner accounts often cannot iam:CreateRole. Use an existing role
# that trusts ecs-tasks.amazonaws.com and has AmazonECSTaskExecutionRolePolicy attached
# (ECS console "first run" creates "ecsTaskExecutionRole" in many accounts).
data "aws_iam_role" "ecs_execution" {
  name = var.ecs_task_execution_role_name
}
