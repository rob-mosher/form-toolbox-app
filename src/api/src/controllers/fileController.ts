import { RequestHandler } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { createError } from '../utils/error'

const clearStoredUploads: RequestHandler = (req, res, next) => {
  const dirName = path.resolve(path.dirname(require.main!.filename), 'public/data/uploads')
  fs.readdir(dirName)
    .then((fileNames) => Promise.all(
      fileNames.map((fileName) => fs.unlink(path.resolve(dirName, fileName))),
    ))
    .then(() => next())
    .catch((err) => next(createError({
      method: `${__filename}:clearStoredUploads`,
      err,
    })))
}

const fileController = {
  clearStoredUploads,
}

export default fileController
