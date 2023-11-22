resource "aws_iam_policy" "lambda_logging_policy" {
  name        = var.lambda_logging_policy_name
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
        Resource = "arn:aws:logs:${var.region}:${var.aws_caller_identity_current.account_id}:*"
      },
    ]
  })
}

resource "aws_iam_policy" "lambda_s3_policy" {
  name        = var.lambda_s3_policy_name
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
        Resource = "${var.s3_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_sqs_policy" {
  name        = var.lambda_sqs_policy_name
  description = "IAM policy for Lambda function to send messages to SQS."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "sqs:SendMessage",
        Resource = var.sqs_queue_arn
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_textract_policy" {
  name        = var.lambda_textract_policy_name
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

resource "aws_iam_policy" "textract_to_sns_policy" {
  name        = var.textract_to_sns_policy_name
  description = "IAM policy for AWS Textract to publish to SNS."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "sns:Publish",
        Resource = var.sns_topic_arn
      },
    ]
  })
}
