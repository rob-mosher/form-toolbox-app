require('dotenv').config();

const { fromEnv } = require('@aws-sdk/credential-providers');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const { AWS_REGION } = process.env;

const s3Client = new S3Client({
  credentials: fromEnv(),
  region: AWS_REGION,
});

const sendPutObjectCommand = async (commandProps) => {
  // TODO: props validation
  try {
    const command = new PutObjectCommand(commandProps);
    return s3Client.send(command);
  } catch (err) {
    console.error(err); // TODO: custom error handler
  }
};

module.exports = { sendPutObjectCommand };
