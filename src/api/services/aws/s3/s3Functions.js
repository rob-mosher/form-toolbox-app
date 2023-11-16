require('dotenv').config();

const { fromEnv } = require('@aws-sdk/credential-providers');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const textractFunctions = require('../textract/textractFunctions');

const {
  AWS_BUCKET_NAME,
  AWS_REGION,
} = process.env;

const s3Client = new S3Client({
  credentials: fromEnv(),
  region: AWS_REGION,
});

const s3Functions = {};

const generatePresignedUrl = async (bucket, key, expires) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn: expires });
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    throw err;
  }
};

s3Functions.getObject = async (commandProps) => {
  try {
    const command = new GetObjectCommand(commandProps);
    const response = await s3Client.send(command);

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

s3Functions.putObject = async (commandProps) => {
  try {
    const command = new PutObjectCommand(commandProps);
    return s3Client.send(command);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

s3Functions.generatePresignedUrlsFromKeys = async (keys) => {
  const presignedUrls = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    try {
      const url = await generatePresignedUrl(AWS_BUCKET_NAME, key, 60);
      presignedUrls.push(url);
    } catch (err) {
      console.error(`Error generating presigned URL for ${key}:`, err);
      throw err;
    }
  }
  console.log('presignedUrls:', presignedUrls);
  return presignedUrls;
};

s3Functions.getAnalysis = async (analysisFolderNameS3) => {
  // TODO account for multi-page results
  const key = `${analysisFolderNameS3}/1`;

  try {
    const data = await s3Functions.getObject({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });

    // S3 returns a buffer, so utilize `toString('utf-8')` to be safe, although it works without it
    const analysisResults = JSON.parse(data.toString('utf-8'));

    const pageCount = analysisResults.DocumentMetadata.Pages;
    const textractKeyValues = textractFunctions.parseKeyValuePairs(analysisResults);

    console.log('pageCount', pageCount);
    console.log('textractKeyValues', textractKeyValues);

    return {
      pageCount,
      textractKeyValues,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = s3Functions;
