output "sqs_queue_arn" {
  value = aws_sqs_queue.form_toolbox_queue.arn
}

output "sqs_queue_name" {
  value = aws_sqs_queue.form_toolbox_queue.name
}

output "sqs_queue_url" {
  value = aws_sqs_queue.form_toolbox_queue.url
}
