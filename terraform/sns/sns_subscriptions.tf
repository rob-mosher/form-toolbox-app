resource "aws_sns_topic_subscription" "toolbox_topic_subscription" {
  topic_arn = aws_sns_topic.toolbox_topic.arn
  protocol  = "sqs"
  endpoint  = var.sqs_queue_arn
}
