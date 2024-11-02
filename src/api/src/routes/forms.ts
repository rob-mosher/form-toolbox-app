import express, { NextFunction, Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { ACCEPTED_UPLOAD_MIME_TYPES } from '../constants/acceptedUploadMimeTypes'
import bucketController from '../controllers/bucketController'
// import fileController from '../controllers/fileController'
import formController from '../controllers/formController'
import imageController from '../controllers/imageController'
import { FormModel, TemplateModel } from '../models'
import { generatePresignedUrlsFromKeys } from '../services/aws/s3/s3Functions'
import { createError } from '../utils/error'

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const acceptedMimeTypes = new Set([...ACCEPTED_UPLOAD_MIME_TYPES])
  if (!file) return cb(new Error('Missing file')) // TODO: Refactor with custom error handler
  if (!acceptedMimeTypes.has(file.mimetype)) return cb(new Error('Invalid file type')) // TODO: Refactor with custom error handler
  return cb(null, true)
}

const limits = {
  fileSize: 26214400, // 25 MB
}

const useMemory = true
const storage = useMemory
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: 'public/data/uploads',
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  })

const upload = multer({
  fileFilter,
  limits,
  storage,
})

const formsRouter = express.Router()

formsRouter.get(
  '/',

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const forms = await FormModel.findAll({
        where: {
          isDeleted: false,
        },
        include: [{
          model: TemplateModel,
          as: 'template',
          attributes: ['name'],
        }],
        attributes: [
          'createdAt',
          'fileNameOriginal',
          'id',
          'pageCount',
          'status',
          'textractJobId',
        ],
      })
      return res.status(200).json(forms)
    } catch (err) {
      return next(createError({
        err: `Error getting all forms: ${(err as Error).message}`,
        method: `${__filename}:formsRouter.get /`,
        status: 500,
      }))
    }
  },
)

formsRouter.post(
  '/',
  // Creates a 'file' property on the 'req' object
  upload.single('user-upload'),

  // Adds res.locals.form (res.locals.form.id will be referenced throughout)
  formController.createForm,

  // Starts the artifact upload to S3 which triggers textraction etc
  bucketController.putUpload,

  // Local image processing for a preview of each page, then upload
  imageController.convertToPreview,
  bucketController.putPreviewFiles,

  // Only applicable if diskStorage is used, i.e. useMemory === false
  // fileController.clearStoredUploads,

  // Complete the request
  (req, res) => {
    res.sendStatus(201)
  },
)

formsRouter.get(
  '/accepted-mime-types',

  (req: Request, res: Response, next: NextFunction) => {
    try {
      const mimeTypesJson = JSON.stringify(ACCEPTED_UPLOAD_MIME_TYPES)
      return res.status(200).send(mimeTypesJson)
    } catch (err) {
      return next(createError({
        err: `Error processing accepted MIME types: ${(err as Error).message}`,
        method: `${__filename}:formsRouter.get /accepted-mime-types`,
        status: 500,
      }))
    }
  },
)

formsRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.allowDeleted = true
    next()
  },
  formController.getForm,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (res.locals.form.isDeleted) {
        console.log('formsRouter.delete: Form was previously marked as deleted, but returning successfully to preserve idempotency')
        return res.sendStatus(200)
      }

      res.locals.form.formDeclared = null
      res.locals.form.isDeleted = true
      res.locals.form.templateId = null
      await res.locals.form.save()
      return res.sendStatus(200)
    } catch (err) {
      return next(createError({
        err: `Error deleting form: ${(err as Error).message}`,
        method: `${__filename}:formsRouter.delete /:id`,
        status: 500,
      }))
    }
  },
)

formsRouter.get(
  '/:id',
  formController.getForm,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(res.locals.form)
    } catch (err) {
      return next(createError({
        err: `Error getting form: ${(err as Error).message}`,
        method: `${__filename}:formsRouter.get /:id`,
        status: 500,
      }))
    }
  },
)

formsRouter.put(
  '/:id',
  formController.getForm,

  async (req: Request, res: Response, next: NextFunction) => {
    const { updates } = req.body
    const allowedUpdates = new Set([
      'formDeclared',
      'templateId',
    ])

    try {
      if (!updates) {
        throw new Error('No update object was included in the request')
      }

      // Search for unsupported updates
      Object.keys(updates).forEach((key) => {
        if (!allowedUpdates.has(key)) {
          throw new Error(`Update to field '${key}' is not allowed`)
        }
      })

      // Process supported updates
      // For now, handle individually in case specific logic is needed.
      // NOTE: If values match by value, sequelize will not alter changed() to true
      if (updates.templateId) {
        res.locals.form.templateId = updates.templateId
      }

      if (updates.formDeclared) {
        res.locals.form.formDeclared = updates.formDeclared
      }

      if (!res.locals.form.changed()) {
        console.log('formsRouter.put: No valid data needed to be changed, but returning successfully to preserve idempotency')
        return res.sendStatus(201)
      }

      await res.locals.form.save()
      return res.sendStatus(201)
    } catch (err) {
      return next(createError({
        err: `Error updating form: ${(err as Error).message}`,
        method: `${__filename}:formsRouter.put /:id`,
        status: 400,
      }))
    }
  },
)

formsRouter.get(
  '/:id/image-urls',
  formController.getForm,

  async (req: Request, res: Response, next: NextFunction) => {
    const { pageCount } = res.locals.form
    const keys: string[] = []

    for (let i = 1; i <= pageCount; i += 1) {
      const key = `${res.locals.form.previewFolderNameS3}/${i}.webp`
      keys.push(key)
    }

    try {
      const presignedUrls = await generatePresignedUrlsFromKeys(keys)
      return res.json(presignedUrls)
    } catch (err) {
      return next(createError({
        err: `Error generating image URLS: ${(err as Error).message}`,
        method: `${__filename}:formsRouter.get /:id/image-urls`,
        status: 500,
      }))
    }
  },
)

export default formsRouter
