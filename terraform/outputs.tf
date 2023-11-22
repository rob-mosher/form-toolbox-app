output "AWS_BUCKET_NAME" {
  value = module.s3_bucket.s3_bucket_id
}

output "AWS_SQS_QUEUE_NAME" {
  value = module.sqs.sqs_queue_name
}

output "AWS_REGION" {
  value = var.region
}

output "COMPOSE_PROJECT_NAME" {
  value = local.prefix
}
