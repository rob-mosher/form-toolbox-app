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
    # filter_suffix       =
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

resource "aws_iam_policy" "lambda_step_function_policy" {
  name        = "lambda_step_function_policy"
  description = "Policy for Lambda function to interact with Step Functions"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "states:StartExecution",
        Resource = aws_sfn_state_machine.state_machine.arn
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "lambda_step_function_policy_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_step_function_policy.arn
}

resource "aws_lambda_function" "lambda_on_upload" {
  function_name = "ftbx-onUpload"
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
      STATE_MACHINE_ARN = aws_sfn_state_machine.state_machine.arn
    }
  }
}

resource "aws_iam_policy" "sfn_sqs_send_message_policy" {
  name        = "ftbx-SfnSQSSendMessagePolicy"
  description = "Policy that allows the Step Function to send messages to SQS queues"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "sqs:SendMessage",
        Resource = "arn:aws:sqs:${var.region}:${data.aws_caller_identity.current.account_id}:${var.queue_name}.fifo"
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "sfn_sqs_send_message_attach" {
  role       = aws_iam_role.sfn_role.name
  policy_arn = aws_iam_policy.sfn_sqs_send_message_policy.arn
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_on_upload.function_name}"
  retention_in_days = 7
}

resource "aws_sfn_state_machine" "state_machine" {
  name     = "FormToolboxStateMachine"
  role_arn = aws_iam_role.sfn_role.arn

  definition = templatefile("${path.module}/../functions/analyzeDocument/definition.json", {
    Region    = var.region
    AccountId = data.aws_caller_identity.current.account_id
    QueueName = var.queue_name
  })

  logging_configuration {
    include_execution_data = true
    level                  = "ALL"
    log_destination        = "${aws_cloudwatch_log_group.sfn_log_group.arn}:*"
  }
}

resource "aws_iam_role" "sfn_role" {
  name = "ftbx-sfn_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "states.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_full_access" {
  role       = aws_iam_role.sfn_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role_policy_attachment" "textract_full_access" {
  role       = aws_iam_role.sfn_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonTextractFullAccess"
}

resource "aws_iam_policy" "cloudwatch_logs_delivery" {
  name = "ftbx-CloudWatchLogsDeliveryFullAccessPolicy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogDelivery",
          "logs:GetLogDelivery",
          "logs:UpdateLogDelivery",
          "logs:DeleteLogDelivery",
          "logs:ListLogDeliveries",
          "logs:PutResourcePolicy",
          "logs:DescribeResourcePolicies",
          "logs:DescribeLogGroups"
        ],
        "Resource" : "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs_delivery_attach" {
  role       = aws_iam_role.sfn_role.name
  policy_arn = aws_iam_policy.cloudwatch_logs_delivery.arn
}

resource "aws_iam_policy" "xray_access" {
  name = "ftbx-XRayAccessPolicy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords",
          "xray:GetSamplingRules",
          "xray:GetSamplingTargets"
        ],
        "Resource" : [
          "*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "xray_access_attach" {
  role       = aws_iam_role.sfn_role.name
  policy_arn = aws_iam_policy.xray_access.arn
}

resource "aws_cloudwatch_log_group" "sfn_log_group" {
  name              = "/aws/states/ftbx-temporaryloggroup" # TODO make dynamic BUG resolve circular dependency when dynamically referenced
  retention_in_days = 7
}

resource "aws_sqs_queue" "form_toolbox_manual_fifo" {
  name                        = format("%s.fifo", var.queue_name)
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 30
  message_retention_seconds   = 345600 # 4 days in seconds
  max_message_size            = 262144 # 256 KB in bytes
  deduplication_scope         = "queue"
  fifo_throughput_limit       = "perQueue"

  tags = {
    Environment = "development"
  }
}

resource "aws_sqs_queue_policy" "form_toolbox_manual_fifo_policy" {
  queue_url = aws_sqs_queue.form_toolbox_manual_fifo.id

  policy = jsonencode({
    Version = "2012-10-17",
    Id      = "__default_policy_ID",
    Statement = [
      {
        Sid    = "__owner_statement",
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        },
        Action   = "SQS:*",
        Resource = aws_sqs_queue.form_toolbox_manual_fifo.arn
      },
    ]
  })
}

output "s3_bucket_name" {
  value = module.s3_bucket.s3_bucket_id
}
