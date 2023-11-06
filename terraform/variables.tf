variable "bucket_name" {
  description = "The name of the S3 bucket to create."
  type        = string
}

variable "region" {
  description = "The AWS region to create resources in."
  type        = string
}

variable "queue_name" {
  description = "The name of the SQS queue."
  type        = string
}
