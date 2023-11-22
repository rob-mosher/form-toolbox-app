resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_on_upload.arn
  principal     = "s3.amazonaws.com"
  source_arn    = var.s3_bucket_arn
}
