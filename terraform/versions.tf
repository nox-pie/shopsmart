terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.44"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Local backend by default (CI uses Actions cache on terraform/terraform.tfstate).
  # For remote S3 state, use a root backend block with bucket/key/region or init -migrate-state;
  # do not use an empty partial `backend "s3" {}` here — it breaks `terraform plan` unless init is perfect.
}
