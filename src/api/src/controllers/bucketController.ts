import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import { S3_PREVIEWS_FOLDER_NAME } from '../constants/s3FolderNames'
import { putObject } from '../services/aws/s3/s3Functions'
import type { TWebpFile } from '../types'
import { createError } from '../utils/error'

dotenv.config()

if (!process.env.AWS_BUCKET_NAME) throw new Error('Missing AWS_BUCKET_NAME environment variable.')

const { AWS_BUCKET_NAME } = process.env

const putWebpFiles: RequestHandler = async (req, res, next) => {
  if (!res.locals.webpFiles || res.locals.webpFiles.length === 0) {
    return next(new Error('No WEBP files to upload'))
  }

  try {
    const previewFolderNameS3 = `${S3_PREVIEWS_FOLDER_NAME}/${res.locals.form.id}`
    res.locals.form.previewFolderNameS3 = previewFolderNameS3
    console.log(`bucketController.putWebpFiles: Attempting to set 'previewFolderNameS3' for formId: '${res.locals.form.id}'`)
    await res.locals.form.save()

    const uploadPromises = (res.locals.webpFiles as TWebpFile[]).map((file, i) => putObject({
      Bucket: AWS_BUCKET_NAME,
      Key: `${previewFolderNameS3}/${i + 1}.webp`, // Pages are 1-indexed
      Body: file.buffer,
      ContentType: 'image/webp',
    }))

    await Promise.all(uploadPromises)

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
    res.locals.form.fileNameOriginal = req.file.originalname
    res.locals.form.fileNameS3 = fileNameS3
    console.log(`bucketController.putUpload: Attempting to write status, fileNameOriginal, and fileNameS3 to database for the following formId: '${res.locals.form.id}'`)
    await res.locals.form.save()

    console.log(`bucketController.putUpload: Uploading document with the following formId: '${res.locals.form.id}'`)
    await putObject({
      Bucket: AWS_BUCKET_NAME, // string
      Key: fileNameS3, // string
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      Metadata: {
        // NOTE: key will be converted to lower-case, so doing so here.
        formid: res.locals.form.id, // string
      },
    })
  } catch (err) {
    return next(createError({
      err: err as Error,
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
