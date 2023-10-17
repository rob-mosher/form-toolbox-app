// const { putObject } = require('../services/aws/s3/put');
const { createError } = require('../utils/error');

const storageController = {};

const {
  AWS_USER_UPLOAD_BUCKET_NAME,
} = process.env;

storageController.putObject = (req, res, next) => {
  // if (!req.file) {
  //   return next(createError({
  //     err: 'File not found',
  //     method: 'storageController.putObject',
  //     status: '',
  //   }));
  // }
  // try {
  //   console.log('putting');
  //   // putObject(
  //     //   AWS_USER_UPLOAD_BUCKET_NAME,
  //     //   req.file,
  //     //   localFilePath
  //     // );
  //   } catch (errObj) {
  //     console.error(errObj);
  //   }
  console.log('putting');
  return next();
};
