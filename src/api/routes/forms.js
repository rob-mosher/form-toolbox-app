const express = require('express');
const multer = require('multer');

const bucketController = require('../controllers/bucketController');
const fileController = require('../controllers/fileController');
const formController = require('../controllers/formController');
const imageController = require('../controllers/imageController');
const { createError } = require('../utils/error');
const { generatePresignedUrlsFromKeys } = require('../services/aws/s3/s3Functions');
const { ACCEPTED_UPLOAD_MIME_TYPES } = require('../constants/acceptedUploadMimeTypes');
const { Form, FormType } = require('../models');

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

formsRouter.get(
  '/',

  async (req, res, next) => {
    try {
      const forms = await Form.findAll({
        where: {
          isDeleted: false,
        },
        include: [{
          model: FormType,
          as: 'formType',
          attributes: ['name'],
        }],
        attributes: [
          'createdAt',
          'fileName',
          'id',
          'pages',
          'status',
          'textractJobId',
        ],
      });
      return res.status(200).json(forms);
    } catch (err) {
      return next(createError({
        err: `Error getting all forms: ${err.message}`,
        method: `${__filename}:formsRouter.get /`,
        status: 500,
      }));
    }
  }
);

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

formsRouter.get(
  '/accepted-mime-types',

  (req, res, next) => {
    try {
      const mimeTypesJson = JSON.stringify(ACCEPTED_UPLOAD_MIME_TYPES);
      return res.status(200).send(mimeTypesJson);
    } catch (err) {
      return next(createError({
        err: `Error processing accepted MIME types: ${err.message}`,
        method: `${__filename}:formsRouter.get /accepted-mime-types`,
        status: 500,
      }));
    }
  }
);

formsRouter.delete(
  '/:id',
  (req, res, next) => {
    res.locals.allowDeleted = true;
    next();
  },
  formController.getForm,

  async (req, res, next) => {
    try {
      if (res.locals.form.isDeleted) {
        console.log('formsRouter.delete: Form was previously marked as deleted, but returning successfully to preserve idempotency');
        return res.sendStatus(200);
      }

      res.locals.form.isDeleted = true;
      await res.locals.form.save();
      return res.sendStatus(200);
    } catch (err) {
      return next(createError({
        err: `Error deleting form: ${err.message}`,
        method: `${__filename}:formsRouter.delete /:id`,
        status: 500,
      }));
    }
  }
);

formsRouter.get(
  '/:id',
  formController.getForm,

  async (req, res, next) => {
    try {
      return res.status(200).json(res.locals.form);
    } catch (err) {
      return next(createError({
        err: `Error getting form: ${err.message}`,
        method: `${__filename}:formsRouter.get /:id`,
        status: 500,
      }));
    }
  }
);

formsRouter.put(
  '/:id',
  formController.getForm,

  async (req, res, next) => {
    const { updates } = req.body;
    const allowedUpdates = new Set([
      'formData',
      'formTypeId',
    ]);

    try {
      if (!updates) {
        throw new Error('No update object was included in the request');
      }

      // Search for unsupported updates
      Object.keys(updates).forEach((key) => {
        if (!allowedUpdates.has(key)) {
          throw new Error(`Update to field '${key}' is not allowed`);
        }
      });

      // Process supported updates
      // For now, handle individually in case specific logic is needed.
      // NOTE: If values match by value, sequelize will not alter changed() to true
      if (updates.formTypeId) {
        res.locals.form.formTypeId = updates.formTypeId;
      }

      if (updates.formData) {
        res.locals.form.formData = updates.formData;
      }

      if (!res.locals.form.changed()) {
        console.log('formsRouter.put: No valid data needed to be changed, but returning successfully to preserve idempotency');
        return res.sendStatus(201);
      }

      await res.locals.form.save();
      return res.sendStatus(201);
    } catch (err) {
      return next(createError({
        err: `Error updating form: ${err.message}`,
        method: `${__filename}:formsRouter.put /:id`,
        status: 400,
      }));
    }
  }
);

formsRouter.get(
  '/:id/image-urls',
  formController.getForm,

  async (req, res, next) => {
    const { pages: pageCount } = res.locals.form;
    const keys = [];

    for (let i = 1; i <= pageCount; i += 1) {
      const key = `exports/${res.locals.form.id}/${i}.webp`;
      keys.push(key);
    }

    try {
      const presignedUrls = await generatePresignedUrlsFromKeys(keys);
      return res.json(presignedUrls);
    } catch (err) {
      return next(createError({
        err: `Error generating image URLS: ${err.message}`,
        method: `${__filename}:formsRouter.get /:id/image-urls`,
        status: 500,
      }));
    }
  }
);

module.exports = formsRouter;
