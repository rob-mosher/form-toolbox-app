const crypto = require('crypto');
const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn");

const client = new SFNClient({ region: "us-east-1" });

module.exports.handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;
  const id = crypto.randomUUID();

  console.log('bucketName', bucketName);
  console.log('objectKey', objectKey);
  console.log('id', id);

  const params = {
    stateMachineArn: process.env.STATE_MACHINE_ARN,
    input: JSON.stringify({ bucket: bucketName, key: objectKey }),
    name: id,
  };

  try {
    const command = new StartExecutionCommand(params);
    const execution = await client.send(command);
  }
  catch (error) {
    console.error(error);
    throw new Error('Error starting Step Functions execution.');
  }
};
