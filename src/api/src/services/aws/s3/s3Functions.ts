// TODO finish typescript conversion

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'
import { parseKeyValuePairs } from '../textract/textractFunctions'

dotenv.config()

if (!process.env.AWS_BUCKET_NAME) throw new Error('Missing AWS_BUCKET_NAME environment variable.')
if (!process.env.AWS_REGION) throw new Error('Missing AWS_REGION environment variable.')

const {
  AWS_BUCKET_NAME,
  AWS_REGION,
} = process.env

const s3Client = new S3Client({
  credentials: fromEnv(),
  region: AWS_REGION,
})

// Helper function -- do not export
async function generatePresignedUrl(bucket, key, expires) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  try {
    return await getSignedUrl(s3Client, command, { expiresIn: expires })
  } catch (err) {
    console.error('Error generating presigned URL:', err)
    throw err
  }
}

async function generatePresignedUrlsFromKeys(keys) {
  const presignedUrls = []

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    try {
      const url = await generatePresignedUrl(AWS_BUCKET_NAME, key, 60)
      presignedUrls.push(url)
    } catch (err) {
      console.error(`Error generating presigned URL for ${key}:`, err)
      throw err
    }
  }
  console.log('presignedUrls:', presignedUrls)
  return presignedUrls
}

async function getAnalysis(analysisFolderNameS3) {
  // TODO account for multi-page results
  const key = `${analysisFolderNameS3}/1`

  try {
    // eslint-disable-next-line no-use-before-define
    const data = await getObject({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    })

    // S3 returns a buffer, so utilize `toString()` to be safe, although it works without it
    const analysisResults = JSON.parse(data.toString())

    const pageCount = analysisResults.DocumentMetadata.Pages
    const textractKeyValueAndBoundingBoxes = parseKeyValuePairs(analysisResults)

    console.log('pageCount', pageCount)
    console.log('textractKeyValueAndBoundingBoxes', textractKeyValueAndBoundingBoxes)

    return {
      pageCount,
      textractKeyValueAndBoundingBoxes,
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

async function getObject(commandProps) {
  try {
    const command = new GetObjectCommand(commandProps)
    const response = await s3Client.send(command)

    return new Promise((resolve, reject) => {
      const chunks = []
      // @ts-expect-error TODO refactor
      response.Body.on('data', (chunk) => chunks.push(chunk))
      // @ts-expect-error TODO refactor
      response.Body.on('end', () => resolve(Buffer.concat(chunks)))
      // @ts-expect-error TODO refactor
      response.Body.on('error', reject)
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function putObject(commandProps) {
  try {
    const command = new PutObjectCommand(commandProps)
    return s3Client.send(command)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export {
  generatePresignedUrlsFromKeys,
  getAnalysis,
  getObject,
  putObject,
}
