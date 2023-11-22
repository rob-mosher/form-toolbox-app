resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.lambda_log_group_name}"
  retention_in_days = 7
}
