// TODO finish typescript conversion

import dotenv from 'dotenv'
import { requeueMessage } from './sqsFunctions'
import { FormModel } from '../../../models'
import { getAnalysis } from '../s3/s3Functions'

dotenv.config()

const { AWS_SQS_REQUEUE_MAX_RETRIES } = process.env

const processMessage = async (mes) => {
  console.log('Processing message: ', mes.Body)

  const parsedBody = JSON.parse(mes.Body)
  const parsedMessageContent = JSON.parse(parsedBody.Message)

  // NOTE AWS textract is limited in how it can be structured, so "JobId" is "textractJobId"
  const {
    JobId: textractJobId,
    Status: status,
    FormId: formId,
  } = parsedMessageContent

  switch (status) {
    case 'ANALYZING': {
      console.log(`Form ${formId} is being analyzed on textract.`)

      const [updatedRows] = await FormModel.update(
        {
          status: 'analyzing',
          textractJobId,
          analysisFolderNameS3: `analysis/${textractJobId}`,
        },
        {
          where: {
            id: formId,
          },
        }
      )
      if (updatedRows === 0) {
        console.warn(`Form ${formId} was not set to 'analyzing'.`)
      }
      break
    }

    case 'FAILED': {
      console.log(`Form ${formId} encountered an error.`)

      const [updatedRows] = await FormModel.update(
        {
          status: 'error',
          textractJobId,
        },
        {
          where: {
            id: formId,
          },
        }
      )
      if (updatedRows === 0) {
        console.warn(`Form ${formId} was not set to 'error'.`)
      }
      break
    }

    // 'SUCCEEDED' in AWS Textract denotes a completed analysis.
    case 'SUCCEEDED': {
      console.log(`Form with textractJobId ${textractJobId} has completed the textract process.`)

      // Find the form with the given textractJobId
      const form = await FormModel.findOne({
        where: { textractJobId },
      })

      if (!form) {
        const retryCount = (parsedBody.RetryCount || 0)

        if (retryCount <= AWS_SQS_REQUEUE_MAX_RETRIES) {
          await requeueMessage(parsedBody.Message, retryCount)
          console.warn(`Requeued message for textractJobId ${textractJobId}. Retry count is expected to be: ${retryCount + 1}`)
        } else {
          console.error(`Max retries reached for message: ${mes.MessageId}`)
          // Handle max retries (e.g., log, move to DLQ)
        }
        break
      }

      // Extract the analysisFolderNameS3
      // @ts-expect-error TODO refactor with an all-container type solution
      const { analysisFolderNameS3 } = form

      // Extract various information about the analysis
      const {
        pageCount,
        textractKeyValueAndBoundingBoxes,
      } = await getAnalysis(analysisFolderNameS3)

      // Update the form
      // @ts-expect-error TODO refactor with an all-container type solution
      form.pageCount = pageCount
      // @ts-expect-error TODO refactor with an all-container type solution
      form.status = 'ready'
      // @ts-expect-error TODO refactor with an all-container type solution
      form.textractKeyValueAndBoundingBoxes = textractKeyValueAndBoundingBoxes
      await form.save()

      console.log(`Form with textractJobId ${textractJobId} has been set to 'ready'.`)
      break
    }

    default: {
      console.log(`No matching action for status ${status}`)
    }
  }
}

export { processMessage }
