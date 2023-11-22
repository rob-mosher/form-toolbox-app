### Policy Attachments ###

output "lambda_logs_policy_attachment" {
  value = aws_iam_role_policy_attachment.lambda_logs_policy_attach
}

output "lambda_s3_policy_attachment" {
  value = aws_iam_role_policy_attachment.lambda_s3_policy_attach
}

output "lambda_sqs_policy_attachment" {
  value = aws_iam_role_policy_attachment.lambda_sqs_policy_attach
}

output "lambda_textract_policy_attachment" {
  value = aws_iam_role_policy_attachment.lambda_textract_policy_attach
}

### Role ARNs ###

output "lambda_exec_role_arn" {
  value = aws_iam_role.lambda_exec_role.arn
}

output "textract_to_sns_role_arn" {
  value = aws_iam_role.textract_to_sns_role.arn
}
