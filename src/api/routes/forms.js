const express = require('express');
const multer = require('multer');
const { Op } = require('sequelize');

const bucketController = require('../controllers/bucketController');
const fileController = require('../controllers/fileController');
const formController = require('../controllers/formController');
const imageController = require('../controllers/imageController');
const { generatePresignedUrlsFromKeys } = require('../services/aws/s3/s3Functions');
const { ACCEPTED_UPLOAD_MIME_TYPES } = require('../constants/acceptedUploadMimeTypes');
const { Form } = require('../models');

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

const formsRouter = express.Router();

formsRouter.get('/', async (req, res, next) => {
  try {
    const forms = await Form.findAll({
      where: {
        isDeleted: false,
      },
    });
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.post(
  '/',
  // Creates a 'file' property on the 'req' object
  upload.single('user-upload'),

  // Adds res.locals.form (res.locals.form.id will be referenced throughout)
  formController.createForm,

  // Starts the artifact upload to S3 which triggers textraction etc
  bucketController.putUpload,

  // Local image processing for a screenshot of each page, then upload
  imageController.convertToWebp,
  bucketController.putWebpFiles,

  // Only applicable if diskStorage is used, i.e. useMemory === false
  // fileController.clearStoredUploads,

  // Complete the request
  (req, res, next) => {
    res.sendStatus(201);
  }
);

formsRouter.get('/accepted-mime-types', (req, res, next) => {
  res.status(200).send(JSON.stringify(ACCEPTED_UPLOAD_MIME_TYPES));
});

formsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (!form.isDeleted) {
      form.isDeleted = true;
      await form.save();
    } else {
      console.log(`Form ${id} previously marked as deleted, so no action is needed, but proceeding as if delete action took place from the user's perspective.`);
    }

    return res.status(200).json({ message: 'Form marked as deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.isDeleted) {
      return res.status(404).json({ message: 'Form is deleted and not accessible' });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.get('/:id/image-urls', async (req, res, next) => {
  const { id } = req.params;
  const form = await Form.findByPk(id);

  if (!form || form.isDeleted) {
    return res.status(404).json({ error: 'Form not found, or has been deleted' });
  }

  const { pages: pageCount } = form;
  const keys = [];

  for (let i = 1; i <= pageCount; i += 1) {
    const key = `exports/${id}/${i}.webp`;
    keys.push(key);
  }

  try {
    const presignedUrls = await generatePresignedUrlsFromKeys(keys);
    return res.json(presignedUrls);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error generating URLs' });
  }
});

module.exports = formsRouter;
