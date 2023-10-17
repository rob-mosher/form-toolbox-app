require('dotenv').config({ path: '../../.env' });
// const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const {
  // AWS_USER_UPLOAD_BUCKET_NAME,
  AWS_USER_UPLOAD_BUCKET_REGION,
} = process.env;

// const s3Client = new S3Client({
//   region: AWS_USER_UPLOAD_BUCKET_REGION,
// });

const putObject = async (bucketName, objectKey, localFilePath) => {
  // const command = new PutObjectCommand({
  //   Bucket: bucketName,
  //   Key: objectKey,
  //   Body: localFilePath,
  // });
  // return s3Client.send(command);
};

module.exports = { putObject };
