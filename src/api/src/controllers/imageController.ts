import { RequestHandler } from 'express'
import { fromBuffer as pdf2picFromBuffer } from 'pdf2pic'
import type { Options as TOptions } from 'pdf2pic/dist/types/options'
import sharp from 'sharp'
import path from 'path'
import type { TWebpFile } from '../types'

// TODO: Refine this approach, perhaps with ConvertResponse or WriteImageResponse
interface TConversionResult {
  buffer: Buffer
  name: string
  page: number
  path: string
  size: string | undefined
}

const createWebpFromImage = async (file: Express.Multer.File): Promise<TWebpFile> => {
  const webpBuffer = await sharp(file.buffer).webp().toBuffer()
  return {
    buffer: webpBuffer,
    filename: '', // filename will be set by controller
  }
}

const createWebpFromPdf = async (file: Express.Multer.File): Promise<TWebpFile> => {
  const options: TOptions = {
    density: 300,
    format: 'webp',
    width: 2048,
    height: 2048,
    quality: 80,
    preserveAspectRatio: true,
    saveFilename: 'page',
    savePath: '/tmp',
  }

  const converted = pdf2picFromBuffer(file.buffer, options)
  // TODO: Handle multi-page PDFs
  const result = await converted(1) as TConversionResult

  if (!result?.path) {
    throw new Error('PDF conversion failed to produce valid output')
  }

  const webpBuffer = await sharp(result.path).toBuffer()
  return {
    buffer: webpBuffer,
    filename: '', // filename will be set by controller
  }
}

const convertToWebp: RequestHandler = async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file provided'))
  }

  try {
    const fileType = path.extname(req.file.originalname).toLowerCase()
    const outputFiles: TWebpFile[] = []

    switch (fileType) {
      case '.jpg':
      case '.jpeg':
      case '.png': {
        const webpFile = await createWebpFromImage(req.file)
        outputFiles.push({
          ...webpFile,
          filename: '1.webp',
        })
        break
      }
      case '.pdf': {
        const webpFile = await createWebpFromPdf(req.file)
        outputFiles.push({
          ...webpFile,
          filename: '1.webp',
        })
        break
      }
      default:
        throw new Error(`Unsupported file type: ${fileType}`)
    }

    res.locals.webpFiles = outputFiles
    return next()
  } catch (err) {
    console.error('convertToWebp: Error during conversion:', err)
    return next(err)
  }
}

const imageController = {
  convertToWebp,
}

export default imageController
