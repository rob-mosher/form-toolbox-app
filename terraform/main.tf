terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.26"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = var.region
}

provider "random" {}

locals {
  prefix = "formtoolbox-${random_string.shared_id.result}"
}

module "iam" {
  source = "./iam"

  region = var.region

  aws_caller_identity_current = data.aws_caller_identity.current

  sns_topic_arn = module.sns.sns_topic_arn
  sqs_queue_arn = module.sqs.sqs_queue_arn
  s3_bucket_arn = module.s3_bucket.s3_bucket_arn

}

module "lambda" {
  source = "./lambda"

  region = var.region

  bucket_id                         = module.s3_bucket.s3_bucket_id
  lambda_exec_role_arn              = module.iam.lambda_exec_role_arn
  lambda_logs_policy_attachment     = module.iam.lambda_logs_policy_attachment
  lambda_sqs_policy_attachment      = module.iam.lambda_sqs_policy_attachment
  lambda_s3_policy_attachment       = module.iam.lambda_s3_policy_attachment
  lambda_textract_policy_attachment = module.iam.lambda_textract_policy_attachment
  s3_bucket_arn                     = module.s3_bucket.s3_bucket_arn
  sns_topic_arn                     = module.sns.sns_topic_arn
  sqs_queue_url                     = module.sqs.sqs_queue_url
  textract_to_sns_role_arn          = module.iam.textract_to_sns_role_arn
}

module "s3_bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "3.15.1"
  bucket        = "${local.prefix}-s3-bucket"
  force_destroy = true # TODO remove later
}

module "sns" {
  source = "./sns"

  sns_topic_name = "${local.prefix}-sns-topic"

  sqs_queue_arn            = module.sqs.sqs_queue_arn
  textract_to_sns_role_arn = module.iam.textract_to_sns_role_arn
}

module "sqs" {
  source = "./sqs"

  queue_name = "${local.prefix}-sqs-queue"

  sns_topic_arn = module.sns.sns_topic_arn
}

# Used by AWS' S3 module. TODO: find a more appropriate place for this.
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = module.s3_bucket.s3_bucket_id

  lambda_function {
    lambda_function_arn = module.lambda.lambda_on_upload_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }
}

resource "random_string" "shared_id" {
  length      = 8
  min_lower   = 1
  min_numeric = 1
  special     = false
  upper       = false
}
