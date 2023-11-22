variable "bucket_id" {
  description = "ID of the S3 bucket"
  type        = string
}

variable "lambda_exec_role_arn" {
  description = "The ARN of the IAM role that allows the Lambda function to execute."
  type        = string
}

variable "lambda_logs_policy_attachment" {
  description = "The IAM role policy attachment that allows the Lambda function to write logs."
  type        = any
}

variable "lambda_s3_policy_attachment" {
  description = "The IAM role policy attachment that allows the Lambda function to read from S3."
  type        = any
}

variable "lambda_sqs_policy_attachment" {
  description = "The IAM role policy attachment that allows the Lambda function to read from SQS."
  type        = any
}

variable "lambda_textract_policy_attachment" {
  description = "The IAM role policy attachment that allows the Lambda function to use Textract."
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

variable "sqs_queue_url" {
  description = "The URL of the SQS queue."
  type        = string
}

variable "textract_to_sns_role_arn" {
  description = "The ARN of the IAM role that allows Textract to publish to SNS."
  type        = string
}
