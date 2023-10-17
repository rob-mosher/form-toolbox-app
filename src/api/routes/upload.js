const express = require('express');
const multer = require('multer');

const fileController = require('../controllers/fileController');
const bucketController = require('../controllers/bucketController');

function fileFilter(req, file, cb) {
  const acceptedMimeTypes = new Set([
    'application/pdf',
    'image/jpg',
    'image/jpeg',
    'image/png',
  ]);
  if (!file) return cb(new Error('Missing file')); // TODO: Refactor with custom error handler
  if (!acceptedMimeTypes.has(file.mimetype)) return cb(new Error('Invalid file type')); // TODO: Refactor with custom error handler
  return cb(null, true)
}

const limits = {
  fileSize: 26214400 // 25 MB
}

const useMemory = true,
  storage = useMemory ?
    multer.memoryStorage() :
    multer.diskStorage({
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
  (req, res) => {
    res.sendStatus(201);
  }
);

module.exports = uploadRouter;
