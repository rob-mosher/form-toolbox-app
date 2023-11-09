const crypto = require('crypto');
const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn");
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");

const sfnClient = new SFNClient({ region: process.env.REGION });
const s3Client = new S3Client({ region: process.env.REGION });

module.exports.handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;
  const id = crypto.randomUUID();

  // Retrieve object metadata, such as the formid (NOTE was case-converted from formId earlier)
  const headObjectParams = {
    Bucket: bucketName,
    Key: objectKey,
  };
  let metadata;
  try {
    const headObjectOutput = await s3Client.send(new HeadObjectCommand(headObjectParams));
    metadata = headObjectOutput.Metadata;
  } catch (error) {
    console.error('Error retrieving object metadata:', error);
    throw error;
  }

  console.log('bucketName', bucketName);
  console.log('objectKey', objectKey);
  console.log('id', id);
  console.log('metadata:', metadata);

  const input = JSON.stringify({
    bucket: bucketName,
    id,
    key: objectKey,
    formid: metadata.formid, 
  });

  const sfnParams = {
    stateMachineArn: process.env.STATE_MACHINE_ARN,
    input: input,
    name: id,
  };

  try {
    const command = new StartExecutionCommand(sfnParams);
    const execution = await sfnClient.send(command);
  }
  catch (error) {
    console.error(error);
    throw new Error('Error starting Step Functions execution.');
  }
};
