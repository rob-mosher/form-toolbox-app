const { Op } = require('sequelize');
const { Form } = require('../../../models');

const processMessage = async (message) => {
  console.log('Processing message: ', message.Body);

  // TODO perhaps standardize on a Reason: key, aimed towards failure states
  const {
    Status: status,
    TextractJobId: textractJobId,
    FormId: formId,
  } = JSON.parse(message.Body);

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
    default: {
      console.log(`No matching action for status ${status}`);
    }
  }
};

module.exports = {
  processMessage,
};
