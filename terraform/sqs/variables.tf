variable "queue_name" {
  description = "The name of the SQS queue."
  type        = string
}

variable "sns_topic_arn" {
  description = "The ARN of the SNS topic."
  type        = string
}
