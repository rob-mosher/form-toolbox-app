output "s3_bucket_name" {
  value = module.s3_bucket.s3_bucket_id
}

output "sns_topic_arn" {
  value = module.sns.sns_topic_arn
}

output "sqs_queue_url" {
  value = module.sqs.sqs_queue_url
}

output "textract_to_sns_role_arn" {
  value = module.iam.textract_to_sns_role_arn
}
