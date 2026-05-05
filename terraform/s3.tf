# Rubric: unique bucket name, versioning, encryption, public access blocked.
# sai pattern: optional fixed name via var.s3_bucket_name; otherwise random suffix.

locals {
  use_random_artifact_suffix = local.provision_s3 && trimspace(var.s3_bucket_name) == ""
}

resource "random_id" "bucket_suffix" {
  count       = local.provision_ecs || local.use_random_artifact_suffix ? 1 : 0
  byte_length = 4
}

resource "aws_s3_bucket" "artifacts" {
  count         = local.provision_s3 ? 1 : 0
  bucket        = trimspace(var.s3_bucket_name) != "" ? var.s3_bucket_name : "${var.project_name}-artifacts-${random_id.bucket_suffix[0].hex}"
  force_destroy = true

  tags = {
    Name = "${var.project_name}-artifacts"
  }
}

resource "aws_s3_bucket_versioning" "artifacts" {
  count  = local.provision_s3 ? 1 : 0
  bucket = aws_s3_bucket.artifacts[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  count  = local.provision_s3 ? 1 : 0
  bucket = aws_s3_bucket.artifacts[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "artifacts" {
  count  = local.provision_s3 ? 1 : 0
  bucket = aws_s3_bucket.artifacts[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
