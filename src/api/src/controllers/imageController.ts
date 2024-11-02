import { RequestHandler } from 'express'
import { fromBuffer as pdf2picFromBuffer } from 'pdf2pic'
import type { Options as TOptions } from 'pdf2pic/dist/types/options'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { TEMP_UPLOAD_DIR } from '../constants/paths'
import type { TPreviewFile } from '../types'

// TODO: Refine this approach, perhaps with ConvertResponse or WriteImageResponse
interface TConversionResult {
  buffer: Buffer
  name: string
  page: number
  path: string
  size: string | undefined
}

const createPreviewFromImage = async (file: Express.Multer.File): Promise<TPreviewFile> => {
  const sourceContent = file.buffer || await fs.readFile(file.path)
  const previewBuffer = await sharp(sourceContent).webp().toBuffer()
  return {
    buffer: previewBuffer,
    filename: '', // filename will be set by controller
  }
}

const createPreviewFromPdf = async (file: Express.Multer.File): Promise<TPreviewFile> => {
  const sourceContent = file.buffer || await fs.readFile(file.path)
  const options: TOptions = {
    density: 300,
    format: 'webp',
    width: 2048,
    height: 2048,
    quality: 80,
    preserveAspectRatio: true,
    saveFilename: 'page',
    savePath: TEMP_UPLOAD_DIR,
  }

  const converted = pdf2picFromBuffer(sourceContent, options)
  // TODO: Handle multi-page PDFs
  const result = await converted(1) as TConversionResult

  if (!result?.path) {
    throw new Error('PDF conversion failed to produce valid output')
  }

  // TODO: Continue using pdf2pic instead of sharp for this portion
  const previewBuffer = await sharp(result.path).toBuffer()
  return {
    buffer: previewBuffer,
    filename: '', // filename will be set by controller
  }
}

const convertToPreview: RequestHandler = async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file provided'))
  }

  try {
    const fileType = path.extname(req.file.originalname).toLowerCase()
    const previewFiles: TPreviewFile[] = []

    switch (fileType) {
      case '.jpg':
      case '.jpeg':
      case '.png': {
        const previewFile = await createPreviewFromImage(req.file)
        previewFiles.push({
          ...previewFile,
          filename: '1.webp',
        })
        break
      }
      case '.pdf': {
        const previewFile = await createPreviewFromPdf(req.file)
        previewFiles.push({
          ...previewFile,
          filename: '1.webp',
        })
        break
      }
      default:
        throw new Error(`Unsupported file type: ${fileType}`)
    }

    res.locals.previewFiles = previewFiles
    return next()
  } catch (err) {
    console.error('convertToPreview: Error during conversion:', err)
    return next(err)
  }
}

const imageController = {
  convertToPreview,
}

export default imageController
