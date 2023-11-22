variable "sns_topic_name" {
  description = "The name of the SNS topic to create."
  type        = string
}

variable "sqs_queue_arn" {
  description = "The ARN of the SQS queue."
  type        = string
}

variable "textract_to_sns_role_arn" {
  description = "The ARN of the IAM role that allows Textract to publish to SNS."
  type        = string
}
