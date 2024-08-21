import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { fromEnv } from '@aws-sdk/credential-providers'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.AWS_ACCOUNT_NUMBER) throw new Error('Missing AWS_ACCOUNT_NUMBER environment variable.')
if (!process.env.AWS_REGION) throw new Error('Missing AWS_REGION environment variable.')
if (!process.env.AWS_SQS_REQUEUE_DELAY) throw new Error('Missing AWS_SQS_REQUEUE_DELAY environment variable.')
if (!process.env.AWS_SQS_QUEUE_NAME) throw new Error('Missing AWS_SQS_QUEUE_NAME environment variable.')

const {
  AWS_ACCOUNT_NUMBER,
  AWS_REGION,
  AWS_SQS_QUEUE_NAME,
} = process.env

const AWS_SQS_REQUEUE_DELAY = Number(process.env.AWS_SQS_REQUEUE_DELAY)

const queueURL = `https://sqs.${AWS_REGION}.amazonaws.com/${AWS_ACCOUNT_NUMBER}/${AWS_SQS_QUEUE_NAME}`

const sqsClient = new SQSClient({
  region: AWS_REGION,
  credentials: fromEnv(),
})

async function requeueMessage(messageJSON, retryCount) {
  const newRetryCount = retryCount + 1
  console.log('newRetryCount', newRetryCount)

  // NOTE sqsParams (and its messageJSON) are aimed to match structure of textract's JSON output.
  // This simplifies the message processor logic when messages are polled from the SQS queue.
  const sqsMessageBodyJSON = JSON.stringify({
    Type: 'Notification',
    Message: messageJSON,
    RetryCount: newRetryCount,
  })

  const backoffDelaySeconds = AWS_SQS_REQUEUE_DELAY * newRetryCount
  console.log('backoffDelaySeconds', backoffDelaySeconds)

  const sendMessageParams = {
    DelaySeconds: backoffDelaySeconds,
    MessageBody: sqsMessageBodyJSON,
    QueueUrl: queueURL,
  }

  try {
    await sqsClient.send(new SendMessageCommand(sendMessageParams))
    console.log('Message requeued to SQS successfully')
  } catch (error) {
    console.error('Error requeuing message to SQS:', error)
  }
}

export { requeueMessage }
