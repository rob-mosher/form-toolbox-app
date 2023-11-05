variable "bucket_name" {
  description = "The name of the S3 bucket to create."
  type        = string
}

variable "lambda_function_arn_on_upload" {
  description = "ARN of the Lambda function for when I file is uploaded."
  type        = string
}

variable "region" {
  description = "The AWS region to create resources in."
  type        = string
}

