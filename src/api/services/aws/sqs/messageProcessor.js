const processMessage = async (message) => {
  console.log('Processing message: ', message.Body);
};

module.exports = {
  processMessage,
};
