/* eslint-disable no-restricted-syntax */
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs'
import { fromEnv } from '@aws-sdk/credential-providers'
import dotenv from 'dotenv'
import { processMessage } from './messageProcessor'

dotenv.config()

if (!process.env.AWS_ACCOUNT_NUMBER) throw new Error('Missing AWS_ACCOUNT_NUMBER environment variable.')
if (!process.env.AWS_REGION) throw new Error('Missing AWS_REGION environment variable.')
if (!process.env.AWS_SQS_QUEUE_NAME) throw new Error('Missing AWS_SQS_QUEUE_NAME environment variable.')

const {
  AWS_ACCOUNT_NUMBER,
  AWS_REGION,
  AWS_SQS_QUEUE_NAME,
} = process.env

const queueURL = `https://sqs.${AWS_REGION}.amazonaws.com/${AWS_ACCOUNT_NUMBER}/${AWS_SQS_QUEUE_NAME}`
console.log('queueURL:', queueURL)

const sqsClient = new SQSClient({
  region: AWS_REGION,
  credentials: fromEnv(),
})

const pollSQS = async () => {
  const params = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ['All'],
    WaitTimeSeconds: 20, // Long polling
  }

  const receiveMessageCommand = new ReceiveMessageCommand(params)

  try {
    const data = await sqsClient.send(receiveMessageCommand)

    if (data.Messages) {
      for (const message of data.Messages) {
        // Process the message as required
        // eslint-disable-next-line no-await-in-loop
        await processMessage(message)

        // Delete the message from the queue after processing
        const deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: message.ReceiptHandle,
        }
        const deleteMessageCommand = new DeleteMessageCommand(deleteParams)
        // eslint-disable-next-line no-await-in-loop
        await sqsClient.send(deleteMessageCommand)
      }
    }
  } catch (err) {
    console.error('Error receiving messages: ', err)
  }
}

export function startPolling() {
  console.log('Starting SQS polling...')
  // Poll every 20 seconds
  setInterval(pollSQS, 20000)
}
