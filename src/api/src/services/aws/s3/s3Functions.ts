import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'
import { FormDataValueType } from '../../../types'
import { parseKeyValuePairs } from '../textract/textractFunctions'

dotenv.config()

if (!process.env.AWS_BUCKET_NAME) throw new Error('Missing AWS_BUCKET_NAME environment variable.')
if (!process.env.AWS_REGION) throw new Error('Missing AWS_REGION environment variable.')

const { AWS_BUCKET_NAME, AWS_REGION } = process.env

const s3Client = new S3Client({
  credentials: fromEnv(),
  region: AWS_REGION,
})

// Helper function -- do not export
async function generatePresignedUrl(
  bucket: string,
  key: string,
  expires: number,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  try {
    return await getSignedUrl(s3Client, command, { expiresIn: expires })
  } catch (err: unknown) {
    console.error('Error generating presigned URL:', err)
    throw err
  }
}

async function generatePresignedUrlsFromKeys(keys: string[]): Promise<string[]> {
  try {
    const presignedUrls = await Promise.all(
      keys.map((key) => generatePresignedUrl(AWS_BUCKET_NAME!, key, 60)),
    )
    console.log('presignedUrls:', presignedUrls)
    return presignedUrls
  } catch (err: unknown) {
    console.error('Error generating presigned URLs:', err)
    throw err
  }
}

async function getObject(commandProps: GetObjectCommandInput): Promise<Buffer> {
  try {
    const command = new GetObjectCommand(commandProps)
    const response = await s3Client.send(command)

    if (!response.Body) {
      throw new Error('No response body')
    }

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      const stream = response.Body as NodeJS.ReadableStream
      stream.on('data', (chunk: Buffer) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  } catch (err: unknown) {
    console.error('Error getting object:', err)
    throw err
  }
}

async function getAnalysis(analysisFolderNameS3: string): Promise<{
  pageCount: number;
  textractKeyValueAndBoundingBoxes: FormDataValueType[];
}> {
  const key = `${analysisFolderNameS3}/1`

  try {
    const data = await getObject({
      Bucket: AWS_BUCKET_NAME!,
      Key: key,
    })

    const analysisResults = JSON.parse(data.toString())
    const pageCount = analysisResults.DocumentMetadata.Pages
    // eslint-disable-next-line max-len
    const textractKeyValueAndBoundingBoxes = parseKeyValuePairs(analysisResults) as FormDataValueType[]

    console.log('pageCount', pageCount)
    console.log('textractKeyValueAndBoundingBoxes', textractKeyValueAndBoundingBoxes)

    return {
      pageCount,
      textractKeyValueAndBoundingBoxes,
    }
  } catch (err: unknown) {
    console.error('Error getting analysis:', (err as Error).message)
    throw new Error((err as Error).message)
  }
}

async function putObject(commandProps: PutObjectCommandInput): Promise<void> {
  try {
    const command = new PutObjectCommand(commandProps)
    await s3Client.send(command)
  } catch (err: unknown) {
    console.error('Error putting object:', (err as Error).message)
    throw err
  }
}

export {
  generatePresignedUrlsFromKeys,
  getAnalysis,
  getObject,
  putObject,
}
