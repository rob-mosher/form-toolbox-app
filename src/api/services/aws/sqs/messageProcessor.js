require('dotenv').config();

const sqsFunctions = require('./sqsFunctions');
const s3Functions = require('../s3/s3Functions');
const { Form } = require('../../../models');

const {
  AWS_SQS_REQUEUE_MAX_RETRIES,
} = process.env;

const processMessage = async (mes) => {
  console.log('Processing message: ', mes.Body);

  const parsedBody = JSON.parse(mes.Body);
  const parsedMessageContent = JSON.parse(parsedBody.Message);

  // NOTE AWS textract is limited in how it can be structured, so "JobId" is "textractJobId"
  const {
    JobId: textractJobId,
    Status: status,
    FormId: formId,
  } = parsedMessageContent;

  switch (status) {
    case 'ANALYZING': {
      console.log(`Form ${formId} is being analyzed on textract.`);

      const [updatedRows] = await Form.update(
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
      );
      if (updatedRows === 0) {
        console.warn(`Form ${formId} was not set to 'analyzing'.`);
      }
      break;
    }

    case 'FAILED': {
      console.log(`Form ${formId} encountered an error.`);

      const [updatedRows] = await Form.update(
        {
          status: 'error',
          textractJobId,
        },
        {
          where: {
            id: formId,
          },
        }
      );
      if (updatedRows === 0) {
        console.warn(`Form ${formId} was not set to 'error'.`);
      }
      break;
    }

    // 'SUCCEEDED' in AWS Textract denotes a completed analysis.
    case 'SUCCEEDED': {
      console.log(`Form with textractJobId ${textractJobId} has completed the textract process.`);

      // Find the form with the given textractJobId
      const form = await Form.findOne({
        where: { textractJobId },
      });

      if (!form) {
        const retryCount = (parsedBody.RetryCount || 0);

        if (retryCount <= AWS_SQS_REQUEUE_MAX_RETRIES) {
          await sqsFunctions.requeueMessage(parsedBody.Message, retryCount);
          console.warn(`Requeued message for textractJobId ${textractJobId}. Retry count is expected to be: ${retryCount + 1}`);
        } else {
          console.error(`Max retries reached for message: ${mes.MessageId}`);
          // Handle max retries (e.g., log, move to DLQ)
        }
        break;
      }

      // Extract the analysisFolderNameS3
      const { analysisFolderNameS3 } = form;

      // Extract various information about the analysis
      const {
        pageCount,
        textractKeyValues,
      } = await s3Functions.getAnalysis(analysisFolderNameS3);

      // Update the form
      form.pages = pageCount;
      form.status = 'ready';
      form.textractKeyValues = textractKeyValues;
      await form.save();

      console.log(`Form with textractJobId ${textractJobId} has been set to 'ready'.`);
      break;
    }

    default: {
      console.log(`No matching action for status ${status}`);
    }
  }
};

module.exports = {
  processMessage,
};
