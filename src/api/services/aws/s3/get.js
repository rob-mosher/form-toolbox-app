require('dotenv').config();

const { fromEnv } = require('@aws-sdk/credential-providers');
const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const { AWS_REGION } = process.env;

const s3Client = new S3Client({
  credentials: fromEnv(),
  region: AWS_REGION,
});

const sendGetObjectCommand = async (commandProps) => {
  try {
    const command = new GetObjectCommand(commandProps);
    const response = await s3Client.send(command);

    // s3Client returns a stream of data.
    return new Promise((resolve, reject) => {
      const chunks = [];
      response.Body.on('data', (chunk) => chunks.push(chunk));
      response.Body.on('end', () => resolve(Buffer.concat(chunks)));
      response.Body.on('error', reject);
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { sendGetObjectCommand };
