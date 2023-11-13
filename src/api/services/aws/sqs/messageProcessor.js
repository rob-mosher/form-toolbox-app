const { Op } = require('sequelize');
const { Form } = require('../../../models');

const processMessage = async (mes) => {
  console.log('Processing message: ', mes.Body);

  const parsedBody = JSON.parse(mes.Body);
  const {
    // NOTE AWS textract is limited in how it can be structured, so "JobId" is "textractJobId"
    JobId: textractJobId,
    Status: status,
    FormId: formId,
  } = JSON.parse(parsedBody.Message); // NOTE this is how AWS textract forms their data

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
    case 'SUCCEEDED': {
      console.log(`Form with textractJobId ${textractJobId} has completed the textract process.`);

      // TODO add page count etc

      const [updatedRows] = await Form.update(
        {
          status: 'ready',
        },
        {
          where: {
            textractJobId,
          },
        }
      );
      if (updatedRows === 0) {
        console.warn(`Form with textracJobtId ${textractJobId} was not set to 'ready'. A possible race condition was met.`);
      }
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
