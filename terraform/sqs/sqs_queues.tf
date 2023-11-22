resource "aws_sqs_queue" "form_toolbox_queue" {
  name                       = var.queue_name
  visibility_timeout_seconds = 30
  message_retention_seconds  = 345600
  max_message_size           = 262144
}
