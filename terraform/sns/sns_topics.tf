resource "aws_sns_topic" "toolbox_topic" {
  name = var.sns_topic_name
}
