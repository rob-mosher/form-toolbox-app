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
        },
        {
          where: {
            id: formId,
            status: {
              [Op.not]: 'deleted',
            },
          },
        }
      );
      if (updatedRows === 0) {
        console.log(`Form ${formId} was not set to 'analyzing' because its status is 'deleted' or it does not exist.`);
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
            status: {
              [Op.not]: 'deleted',
            },
          },
        }
      );
      if (updatedRows === 0) {
        console.log(`Form ${formId} was not set to 'error' because its status is 'deleted' or it does not exist.`);
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
