import { RequestHandler } from 'express'
import sharp from 'sharp'
import path from 'path'
import { WebpFile } from '../types'

const convertToWebp: RequestHandler = async (req, res, next) => {
  if (!req.file) return next(new Error('No file provided'))

  try {
    const fileType = path.extname(req.file.originalname).toLowerCase()
    const outputFiles: WebpFile[] = []

    if (fileType === '.pdf') {
      // TODO PDF logic
      return next({ log: 'imageController.convertToWebp: Intentional error thrown - middleware does not yet support PDF files.' })
    }

    // Convert single page/image file to WEBP
    const webpBuffer = await sharp(req.file.buffer).webp().toBuffer()
    outputFiles.push({
      buffer: webpBuffer,
      filename: req.file.originalname.replace(fileType, '.webp'),
    })

    res.locals.webpFiles = outputFiles
    return next()
  } catch (err) {
    return next(err)
  }
}

const imageController = {
  convertToWebp,
}

export default imageController
