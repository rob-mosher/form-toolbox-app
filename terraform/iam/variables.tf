variable "aws_caller_identity_current" {
  description = "The AWS caller identity of the current user."
  type        = any
}

variable "region" {
  description = "The AWS region to create resources in."
  type        = string
}

### ARNs ###

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

### Role Names ###

variable "lambda_exec_role_name" {
  description = "The name of the Lambda execution role."
  type        = string
}

variable "textract_to_sns_role_name" {
  description = "The name of the Textract to SNS role."
  type        = string
}

### Policy Names ###

variable "lambda_logging_policy_name" {
  description = "The name of the Lambda logging policy."
  type        = string
}

variable "lambda_s3_policy_name" {
  description = "The name of the Lambda S3 policy."
  type        = string
}

variable "lambda_sqs_policy_name" {
  description = "The name of the Lambda SQS policy."
  type        = string
}

variable "lambda_textract_policy_name" {
  description = "The name of the Lambda Textract policy."
  type        = string
}

variable "textract_to_sns_policy_name" {
  description = "The name of the Textract to SNS policy."
  type        = string
}
