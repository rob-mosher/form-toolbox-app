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
    case 'ANALYZING':
      console.log(`Form ${formId} is being analyzed on textract.`);
      await Form.update(
        {
          status: 'analyzing',
          textractJobId,
        },
        { where: { id: formId } }
      );
      break;
    case 'FAILED':
      console.log(`Form ${formId} encountered an error.`);
      await Form.update(
        {
          status: 'error',
          textractJobId,
        },
        { where: { id: formId } }
      );
      break;
    default:
      console.log(`No matching action for status ${status}`);
  }
};

module.exports = {
  processMessage,
};
