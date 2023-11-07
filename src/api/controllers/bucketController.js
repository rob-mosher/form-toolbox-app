require('dotenv').config();

const { sendPutObjectCommand } = require('../services/aws/s3/put');
const { createError } = require('../utils/error');

const bucketController = {};

const {
  AWS_BUCKET_NAME,
} = process.env;

bucketController.putObject = (req, res, next) => {
  if (!req.file) {
    return next(createError({
      err: 'File not found',
      method: `${__filename}:putObject`,
      status: 500,
    }));
  }

  const { buffer, date, originalname } = res.locals;
  if (!originalname || !buffer) {
    return next(createError({
      err: 'Missing file properties',
      method: `${__filename}:putObject`,
      status: 500,
    }));
  }

  try {
    sendPutObjectCommand({
      Bucket: AWS_BUCKET_NAME, // string
      Key: `uploads/${date}-${originalname}`, // string
      Body: buffer,
    });
  } catch (err) {
    return next(createError({
      err,
      method: `${__filename}:putObject`,
      status: 500,
    }));
  }

  return next();
};

module.exports = bucketController;
