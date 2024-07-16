import dotenv from 'dotenv'

import { Request, RequestHandler } from 'express'

import { putObject } from '../services/aws/s3/s3Functions'
import { createError } from '../utils/error'

dotenv.config()

// TODO refactor placing webpFiles on the req object
interface RequestTemporaryWorkaround extends Request {
  webpFiles?: Array<{ buffer: Buffer }>;
}

const {
  AWS_BUCKET_NAME,
} = process.env

const putWebpFiles: RequestHandler = async (req: RequestTemporaryWorkaround, res, next) => {
  if (!req.webpFiles || req.webpFiles.length === 0) {
    return next(new Error('No WEBP files to upload'))
  }

  try {
    const uploadPromises = req.webpFiles.map((file, i) => putObject({
      Bucket: AWS_BUCKET_NAME,
      Key: `exports/${res.locals.form.id}/${i + 1}.webp`, // Pages are 1-indexed
      Body: file.buffer,
      ContentType: 'image/webp',
    }))

    await Promise.all(uploadPromises)

    const exportFolderNameS3 = `exports/${res.locals.form.id}/`
    res.locals.form.exportFolderNameS3 = exportFolderNameS3
    console.log(`bucketController.putWebpFiles: Attempting to set 'exportFolderNameS3' for formId: '${res.locals.form.id}'`)
    await res.locals.form.save()

    return next()
  } catch (err) {
    return next(err)
  }
}

const putUpload: RequestHandler = async (req, res, next) => {
  if (!req.file) {
    return next(createError({
      err: 'File not found',
      method: `${__filename}:putObject`,
      status: 500,
    }))
  }

  if (!req.file.originalname || !req.file.buffer) {
    return next(createError({
      err: 'Missing file properties',
      method: `${__filename}:putObject`,
      status: 500,
    }))
  }

  const fileNameS3 = `uploads/${res.locals.form.id}/${Date.now()}-${req.file.originalname}`

  try {
    res.locals.form.status = 'uploading'
    res.locals.form.fileName = req.file.originalname
    res.locals.form.fileNameS3 = fileNameS3
    console.log(`bucketController.putUpload: Attempting to write status, fileName, and fileNameS3 to database for the following formId: '${res.locals.form.id}'`)
    await res.locals.form.save()

    console.log(`bucketController.putUpload: Uploading document with the following formId: '${res.locals.form.id}'`)
    putObject({
      Bucket: AWS_BUCKET_NAME, // string
      Key: fileNameS3, // string
      Body: req.file.buffer,
      Metadata: {
        // NOTE: key will be converted to lower-case, so doing so here.
        formid: res.locals.form.id, // string
      },
    })
  } catch (err) {
    return next(createError({
      err,
      method: `${__filename}:putUpload`,
      status: 500,
    }))
  }

  return next()
}

const bucketController = {
  putWebpFiles,
  putUpload,
}

export default bucketController
