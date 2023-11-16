provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

data "archive_file" "on_upload_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../functions/onUpload"
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
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "ftbx-lambda_exec_role"

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

resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "lambda_s3_policy"
  description = "IAM policy for Lambda function to access S3."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:HeadObject"
        ],
        Resource = "${module.s3_bucket.s3_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

resource "aws_iam_policy" "lambda_textract_policy" {
  name        = "lambda_textract_policy"
  description = "IAM policy for Lambda function to access Textract."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "textract:StartDocumentAnalysis",
          "textract:GetDocumentAnalysis"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_textract_policy_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_textract_policy.arn
}

resource "aws_lambda_function" "lambda_on_upload" {
  function_name    = "ftbx-onUpload"
  handler          = "handler.handler"
  runtime          = "nodejs18.x"
  role             = aws_iam_role.lambda_exec_role.arn
  filename         = data.archive_file.on_upload_lambda_zip.output_path
  source_code_hash = data.archive_file.on_upload_lambda_zip.output_base64sha256

  environment {
    variables = {
      REGION                   = var.region
      SNS_TOPIC_ARN            = aws_sns_topic.toolbox_topic.arn
      SQS_TOPIC_URL            = aws_sqs_queue.form_toolbox_queue.url
      TEXTRACT_TO_SNS_ROLE_ARN = aws_iam_role.textract_to_sns.arn
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs_policy_attach,
    aws_iam_role_policy_attachment.lambda_s3_policy_attach,
    aws_iam_role_policy_attachment.lambda_textract_policy_attach,
    aws_iam_role_policy_attachment.lambda_sqs_policy_attach
  ]
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_on_upload.function_name}"
  retention_in_days = 7
}

resource "aws_sqs_queue" "form_toolbox_queue" {
  name                       = var.queue_name
  visibility_timeout_seconds = 30
  message_retention_seconds  = 345600
  max_message_size           = 262144
  # tags = {
  #   Environment = "development"
  # }
}

resource "aws_sqs_queue_policy" "form_toolbox_queue_policy" {
  queue_url = aws_sqs_queue.form_toolbox_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Id      = "form_toolbox_queue_policy",
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
            "aws:SourceArn" = aws_sns_topic.toolbox_topic.arn
          }
        }
      }
    ]
  })
}

resource "aws_sns_topic" "toolbox_topic" {
  name = "toolboxSnsTopic"
}

resource "aws_sns_topic_subscription" "toolbox_topic_subscription" {
  topic_arn = aws_sns_topic.toolbox_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.form_toolbox_queue.arn
}

resource "aws_iam_policy" "lambda_sqs_policy" {
  name        = "lambda_sqs_policy"
  description = "IAM policy for Lambda function to send messages to SQS."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "sqs:SendMessage",
        Resource = aws_sqs_queue.form_toolbox_queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_sqs_policy_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_sqs_policy.arn
}

resource "aws_iam_role" "textract_to_sns" {
  name = "ftbx-textract-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "textract.amazonaws.com"
        },
      },
    ]
  })
}

resource "aws_iam_policy" "textract_to_sns_policy" {
  name        = "textract_to_sns_policy"
  description = "IAM policy for AWS Textract to publish to SNS."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "sns:Publish",
        Resource = aws_sns_topic.toolbox_topic.arn
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "textract_to_sns_policy_attach" {
  role       = aws_iam_role.textract_to_sns.name
  policy_arn = aws_iam_policy.textract_to_sns_policy.arn
}

output "s3_bucket_name" {
  value = module.s3_bucket.s3_bucket_id
}

output "sns_topic_arn" {
  value = aws_sns_topic.toolbox_topic.arn
}

output "sqs_queue_url" {
  value = aws_sqs_queue.form_toolbox_queue.id
}

output "textract_to_sns_role_arn" {
  value = aws_iam_role.textract_to_sns.arn
}
