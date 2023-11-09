require('dotenv').config();

const { sendPutObjectCommand } = require('../services/aws/s3/put');
const { createError } = require('../utils/error');

const { Form } = require('../models');

const bucketController = {};

const {
  AWS_BUCKET_NAME,
} = process.env;

bucketController.putObject = async (req, res, next) => {
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

  const fileNameS3 = `uploads/${date}-${originalname}`;

  const newForm = await Form.create({
    fileName: originalname,
    fileNameS3,
    status: 'uploading',
  });

  const formId = newForm.id;

  try {
    console.log(`Uploading document with the following formId: '${formId}'`);
    sendPutObjectCommand({
      Bucket: AWS_BUCKET_NAME, // string
      Key: fileNameS3, // string
      Body: buffer,
      Metadata: {
        formId, // string (NOTE: key will be converted to lower-case)
      },
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
