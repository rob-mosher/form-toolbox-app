resource "aws_sqs_queue_policy" "form_toolbox_queue_policy" {
  queue_url = aws_sqs_queue.form_toolbox_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Id      = var.form_toolbox_queue_policy_id,
    Statement = [
      {
        Sid    = "Allow-SNS-SendMessage",
        Effect = "Allow",
        Principal = {
          Service = "sns.amazonaws.com"
        },
        Action   = "SQS:SendMessage",
        Resource = aws_sqs_queue.form_toolbox_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.sns_topic_arn
          }
        }
      }
    ]
  })
}
