variable "bucket_name" {
  description = "The name of the S3 bucket to create."
  type        = string
}

variable "region" {
  description = "The AWS region to create resources in."
  type        = string
}

variable "state_machine_arn" {
  description = "The ARN of the Step Function state machine that the Lambda function will trigger."
  type        = string
}
