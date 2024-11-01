#################
### Terraform ###
#################

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

#################
### Providers ###
#################

provider "aws" {
  region = var.region
}

provider "random" {}

##############
### Locals ###
##############

locals {
  prefix = "formtoolbox-${random_string.shared_id.result}"
}

###############
### Modules ###
###############

module "cloudwatch" {
  source                = "./cloudwatch"
  lambda_log_group_name = "${local.prefix}-lambda-on-upload"
}

module "iam" {
  source = "./iam"
  region = var.region

  aws_caller_identity_current = data.aws_caller_identity.current

  sns_topic_arn = module.sns.sns_topic_arn
  sqs_queue_arn = module.sqs.sqs_queue_arn
  s3_bucket_arn = module.s3_bucket.s3_bucket_arn

  lambda_exec_role_name     = "${local.prefix}-lambda-exec-role"
  textract_to_sns_role_name = "${local.prefix}-textract-to-sns-role"

  lambda_logging_policy_name  = "${local.prefix}-lambda-logging-policy"
  lambda_s3_policy_name       = "${local.prefix}-lambda-s3-policy"
  lambda_sqs_policy_name      = "${local.prefix}-lambda-sqs-policy"
  lambda_textract_policy_name = "${local.prefix}-lambda-textract-policy"
  textract_to_sns_policy_name = "${local.prefix}-textract-to-sns-policy"
}

module "lambda" {
  source = "./lambda"
  region = var.region

  bucket_id     = module.s3_bucket.s3_bucket_id
  sqs_queue_url = module.sqs.sqs_queue_url

  lambda_logs_policy_attachment     = module.iam.lambda_logs_policy_attachment
  lambda_s3_policy_attachment       = module.iam.lambda_s3_policy_attachment
  lambda_sqs_policy_attachment      = module.iam.lambda_sqs_policy_attachment
  lambda_textract_policy_attachment = module.iam.lambda_textract_policy_attachment

  lambda_exec_role_arn     = module.iam.lambda_exec_role_arn
  s3_bucket_arn            = module.s3_bucket.s3_bucket_arn
  sns_topic_arn            = module.sns.sns_topic_arn
  textract_to_sns_role_arn = module.iam.textract_to_sns_role_arn

  lambda_on_upload_function_name = "${local.prefix}-lambda-on-upload"
}

module "s3_bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "3.15.1"
  bucket        = "${local.prefix}-s3-bucket"
  force_destroy = true # TODO: remove later
}

module "sns" {
  source = "./sns"

  sns_topic_name = "${local.prefix}-sns-topic"

  sqs_queue_arn            = module.sqs.sqs_queue_arn
  textract_to_sns_role_arn = module.iam.textract_to_sns_role_arn
}

module "sqs" {
  source = "./sqs"

  sns_topic_arn = module.sns.sns_topic_arn

  form_toolbox_queue_policy_id = "${local.prefix}-form-toolbox-queue-policy"
  queue_name                   = "${local.prefix}-sqs-queue"
}

#################
### Resources ###
#################

resource "random_string" "shared_id" {
  length      = 8
  min_lower   = 1
  min_numeric = 1
  special     = false
  upper       = false
}

#############
### Other ###
#############

# Used by AWS' S3 module.
# TODO: find a more appropriate place for this.
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = module.s3_bucket.s3_bucket_id

  lambda_function {
    lambda_function_arn = module.lambda.lambda_on_upload_arn
    events              = ["s3:ObjectCreated:*"]
    # Ensure any changes here are matched with the API's `S3_UPLOADS_FOLDER_NAME`.
    filter_prefix       = "uploads/"
  }
}
