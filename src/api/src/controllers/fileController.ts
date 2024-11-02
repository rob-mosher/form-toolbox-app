import type { RequestHandler as TRequestHandler } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { TEMP_UPLOAD_DIR, createError } from '../lib'

// Ensure temp directory exists on module load
fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true })
  .catch((err) => {
    console.error('Failed to create temporary upload directory:', err)
    process.exit(1) // Exit with error code, stopping the API
  })

const clearStoredUploads: TRequestHandler = async (req, res, next) => {
  try {
    const tempFiles = await fs.readdir(TEMP_UPLOAD_DIR)
    await Promise.all(
      tempFiles.map((tempFile) => {
        console.log(`Deleting temp file: ${TEMP_UPLOAD_DIR}/${tempFile}`)
        return fs.unlink(path.resolve(TEMP_UPLOAD_DIR, tempFile))
      }),
    )
    next()
  } catch (err) {
    next(createError({
      method: `${__filename}:clearStoredUploads`,
      err: err as Error,
    }))
  }
}

const fileController = {
  clearStoredUploads,
}

export default fileController
