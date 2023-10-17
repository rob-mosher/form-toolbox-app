const { promises: fs } = require('fs');
const path = require('path');
const { createError } = require('../utils/error');

const fileController = {};

fileController.validateSingleFileType = (req, res, next) => {
  if (!(req?.file?.mimetype)) {
    return next(createError({
      method: 'validateSingleFileType',
      err: 'Missing file',
    }));
  }
  const acceptedMimeTypes = [
    'application/pdf',
    'image/jpg',
    'image/jpeg',
    'image/png',
  ];
  if (!acceptedMimeTypes.includes(req.file.mimetype)) {
    return next(createError({
      method: 'validateSingleFileType',
      err: 'Uploaded file includes an invalid file type',
      status: 500,
    }));
  }
  return next();
};

fileController.clearStoredUploads = async (req, res, next) => {
  const dirName = path.resolve(path.dirname(require.main.filename), 'public/data/uploads');
  fs.readdir(dirName)
    // eslint-disable-next-line max-len
    .then((fileNames) => Promise.all(fileNames.map((fileName) => fs.unlink(path.resolve(dirName, fileName)))))
    .then(() => next())
    .catch((err) => next(createError({
      method: 'clearStoredUploads',
      err,
    })));
};

module.exports = fileController;
