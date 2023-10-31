const { promises: fs } = require('fs');
const path = require('path');
const { createError } = require('../utils/error');

const fileController = {};

fileController.extractFileProps = (req, res, next) => {
  res.locals = Object.assign(res.locals, req.file, { date: Date.now() });
  return next();
};

fileController.clearStoredUploads = async (req, res, next) => {
  const dirName = path.resolve(path.dirname(require.main.filename), 'public/data/uploads');
  fs.readdir(dirName)
    .then((fileNames) => Promise.all(
      fileNames.map((fileName) => fs.unlink(path.resolve(dirName, fileName)))
    ))
    .then(() => next())
    .catch((err) => next(createError({
      method: `${__filename}:clearStoredUploads`,
      err,
    })));
};

module.exports = fileController;
