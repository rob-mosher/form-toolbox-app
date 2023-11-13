require('dotenv').config();

const { sendGetObjectCommand } = require('./get');

const {
  AWS_BUCKET_NAME,
} = process.env;

const s3Functions = {};

s3Functions.getAnalysis = async (analysisFolderNameS3) => {
  // TODO account for multi-page results
  const key = `${analysisFolderNameS3}/1`;

  try {
    const data = await sendGetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });

    // S3 returns a buffer, so utilize `toString('utf-8')` to be safe, although it works without it
    const analysisResult = JSON.parse(data.toString('utf-8'));
    const pageCount = analysisResult.DocumentMetadata.Pages;

    return { pageCount };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = s3Functions;
