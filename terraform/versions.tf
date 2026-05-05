terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Remote state (sai pattern): configure via `terraform init -backend-config=...`
  # or use `terraform init -backend=false` for local state (default CI without TF_STATE_BUCKET).
  backend "s3" {}
}
