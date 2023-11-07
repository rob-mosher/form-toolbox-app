const express = require('express');
const multer = require('multer');

const fileController = require('../controllers/fileController');
const bucketController = require('../controllers/bucketController');

const { ACCEPTED_UPLOAD_MIME_TYPES } = require('../constants/acceptedUploadMimeTypes');

function fileFilter(req, file, cb) {
  const acceptedMimeTypes = new Set([...ACCEPTED_UPLOAD_MIME_TYPES]);
  if (!file) return cb(new Error('Missing file')); // TODO: Refactor with custom error handler
  if (!acceptedMimeTypes.has(file.mimetype)) return cb(new Error('Invalid file type')); // TODO: Refactor with custom error handler
  return cb(null, true);
}

const limits = {
  fileSize: 26214400, // 25 MB
};

const useMemory = true;
const storage = useMemory
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: 'public/data/uploads',
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const upload = multer({
  fileFilter,
  limits,
  storage,
});

const uploadRouter = express.Router();

uploadRouter.get('/', (req, res) => {
  res.status(200).send(req.originalUrl);
});

uploadRouter.post(
  '/',
  upload.single('user-upload'), // Creates a 'file' property on the 'req' object
  fileController.extractFileProps,
  bucketController.putObject,
  // fileController.clearStoredUploads, // Only applicable if diskStorage is used, i.e. useMemory === false
  (req, res, next) => {
    res.sendStatus(201);
  }
);

uploadRouter.get('/acceptedMimeTypes', (req, res, next) => {
  res.status(200).send(JSON.stringify(ACCEPTED_UPLOAD_MIME_TYPES));
});

module.exports = uploadRouter;
