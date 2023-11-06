provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

data "archive_file" "on_upload_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/onUpload"
  output_path = "${path.module}/on_upload_lambda_function.zip"
}

module "s3_bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "3.15.1"
  bucket        = var.bucket_name
  force_destroy = true # TODO remove later
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_on_upload.arn
  principal     = "s3.amazonaws.com"
  source_arn    = module.s3_bucket.s3_bucket_arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = module.s3_bucket.s3_bucket_id

  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda_on_upload.arn
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

resource "aws_iam_policy" "lambda_logging_policy" {
  name        = "lambda_logging_policy"
  description = "IAM policy for logging from a lambda"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:${var.region}:${data.aws_caller_identity.current.account_id}:*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs_policy_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
}

resource "aws_iam_policy" "lambda_step_function_policy" {
  name        = "lambda_step_function_policy"
  description = "Policy for Lambda function to interact with Step Functions"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "states:StartExecution",
        Resource = var.state_machine_arn
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "lambda_step_function_policy_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_step_function_policy.arn
}

resource "aws_lambda_function" "lambda_on_upload" {
  function_name = "onUpload"
  handler       = "handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec_role.arn

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs_policy_attach,
    aws_iam_role_policy_attachment.lambda_step_function_policy_attach
  ]

  filename         = data.archive_file.on_upload_lambda_zip.output_path
  source_code_hash = data.archive_file.on_upload_lambda_zip.output_base64sha256

  environment {
    variables = {
      STATE_MACHINE_ARN = var.state_machine_arn
    }
  }
}

output "s3_bucket_name" {
  value = module.s3_bucket.s3_bucket_id
}
