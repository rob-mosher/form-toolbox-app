provider "aws" {
  region = var.region
}

module "s3-bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "3.15.1"
  bucket  = var.bucket_name
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_arn_on_upload
  principal     = "s3.amazonaws.com"
  source_arn    = module.s3-bucket.s3_bucket_arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = module.s3-bucket.s3_bucket_id

  lambda_function {
    lambda_function_arn = var.lambda_function_arn_on_upload
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
    # filter_suffix       =
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
      },
    ]
  })
}

output "s3_bucket_name" {
  value = module.s3-bucket.s3_bucket_id
}
