# ECS Fargate + ECR + ALB (Phase 3). LabRole ARN via caller identity (no iam:GetRole).
data "aws_caller_identity" "current" {
  count = var.enable_ecs && trimspace(var.ecs_task_execution_role_arn) == "" ? 1 : 0
}

locals {
  ecs_execution_role_arn = !var.enable_ecs ? "" : (
    trimspace(var.ecs_task_execution_role_arn) != "" ? var.ecs_task_execution_role_arn : "arn:aws:iam::${data.aws_caller_identity.current[0].account_id}:role/${var.ecs_lab_role_name}"
  )
}

resource "aws_ecr_repository" "app" {
  count                = var.enable_ecs ? 1 : 0
  name                 = "${var.project_name}-app-${random_id.bucket_suffix.hex}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_cloudwatch_log_group" "ecs" {
  count             = var.enable_ecs ? 1 : 0
  name              = "/ecs/${var.project_name}-${random_id.bucket_suffix.hex}"
  retention_in_days = 14
}

resource "aws_security_group" "alb" {
  count       = var.enable_ecs ? 1 : 0
  name        = "${var.project_name}-alb-${random_id.bucket_suffix.hex}"
  description = "ALB for ShopSmart"
  vpc_id      = aws_vpc.main[0].id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  count       = var.enable_ecs ? 1 : 0
  name_prefix = "${var.project_name}-ecs-${random_id.bucket_suffix.hex}-"
  description = "ShopSmart Fargate tasks"
  vpc_id      = aws_vpc.main[0].id

  ingress {
    description     = "App from ALB"
    from_port       = 5001
    to_port         = 5001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb[0].id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb" "main" {
  count              = var.enable_ecs ? 1 : 0
  name               = substr("${var.project_name}-alb-${random_id.bucket_suffix.hex}", 0, 32)
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb[0].id]
  subnets            = aws_subnet.public[*].id

  tags = {
    Name = "${var.project_name}-alb"
  }
}

resource "aws_lb_target_group" "app" {
  count       = var.enable_ecs ? 1 : 0
  name        = substr("${var.project_name}-tg-${random_id.bucket_suffix.hex}", 0, 32)
  port        = 5001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main[0].id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http" {
  count             = var.enable_ecs ? 1 : 0
  load_balancer_arn = aws_lb.main[0].arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app[0].arn
  }
}

resource "aws_ecs_cluster" "main" {
  count = var.enable_ecs ? 1 : 0
  name  = "${var.project_name}-cluster-${random_id.bucket_suffix.hex}"
}

resource "aws_ecs_task_definition" "app" {
  count                    = var.enable_ecs ? 1 : 0
  family                   = "${var.project_name}-task-${random_id.bucket_suffix.hex}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = local.ecs_execution_role_arn
  task_role_arn            = local.ecs_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "shopsmart"
      image     = "${aws_ecr_repository.app[0].repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5001
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs[0].name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -fsS http://127.0.0.1:5001/api/health >/dev/null || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 90
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  count                              = var.enable_ecs ? 1 : 0
  name                               = "${var.project_name}-svc-${random_id.bucket_suffix.hex}"
  cluster                            = aws_ecs_cluster.main[0].id
  task_definition                    = aws_ecs_task_definition.app[0].arn
  desired_count                      = 1
  launch_type                        = "FARGATE"
  wait_for_steady_state              = false
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  load_balancer {
    target_group_arn = aws_lb_target_group.app[0].arn
    container_name   = "shopsmart"
    container_port   = 5001
  }

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks[0].id]
    assign_public_ip = true
  }

  depends_on = [aws_lb_listener.http]
}
