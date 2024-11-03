data "archive_file" "on_upload_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/functions/onUpload"
  output_path = "${path.module}/artifacts/on_upload_lambda_function.zip"
}
