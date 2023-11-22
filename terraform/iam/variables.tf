variable "aws_caller_identity_current" {
  description = "The AWS caller identity of the current user."
  type        = any
}

variable "region" {
  description = "The AWS region to create resources in."
  type        = string
}

variable "s3_bucket_arn" {
  description = "The ARN of the S3 bucket."
  type        = string
}

variable "sns_topic_arn" {
  description = "The ARN of the SNS topic."
  type        = string
}

variable "sqs_queue_arn" {
  description = "The ARN of the SQS queue."
  type        = string
}
