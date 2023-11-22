resource "aws_lambda_function" "lambda_on_upload" {
  function_name    = var.lambda_on_upload_function_name
  handler          = "handler.handler"
  runtime          = "nodejs18.x"
  role             = var.lambda_exec_role_arn
  filename         = data.archive_file.on_upload_lambda_zip.output_path
  source_code_hash = data.archive_file.on_upload_lambda_zip.output_base64sha256

  environment {
    variables = {
      REGION                   = var.region
      SNS_TOPIC_ARN            = var.sns_topic_arn
      SQS_TOPIC_URL            = var.sqs_queue_url
      TEXTRACT_TO_SNS_ROLE_ARN = var.textract_to_sns_role_arn
    }
  }

  depends_on = [
    var.lambda_logs_policy_attachment,
    var.lambda_s3_policy_attachment,
    var.lambda_sqs_policy_attachment,
    var.lambda_textract_policy_attachment,
  ]
}
