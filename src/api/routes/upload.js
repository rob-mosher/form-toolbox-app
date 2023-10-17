const express = require('express');
const multer = require('multer');

const fileController = require('../controllers/fileController');
// const storageController = require('../controllers/storageController');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/data/uploads',
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const uploadRouter = express.Router();

uploadRouter.get('/', (req, res) => {
  res.status(200).send(req.originalUrl);
});

uploadRouter.post(
  '/',
  upload.single('user-upload'),
  fileController.validateSingleFileType,
  // storageController.putObject,
  // fileController.clearStoredUploads,
  (req, res) => {
    // file type validation, use env variables
    res.sendStatus(201);
  }
);

module.exports = uploadRouter;
