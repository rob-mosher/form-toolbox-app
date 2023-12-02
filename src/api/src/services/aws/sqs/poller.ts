// TODO finish typescript conversion

/* eslint-disable no-restricted-syntax */
import dotenv from 'dotenv'

import { fromEnv } from '@aws-sdk/credential-providers'
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs'

import { processMessage } from './messageProcessor'

dotenv.config()

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
