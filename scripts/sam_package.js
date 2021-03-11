const sh = require('shelljs');

const { AWS_CLI_PROFILE, BUCKET_NAME, AWS_REGION } = process.env;
const region = AWS_REGION ? AWS_REGION : String(shell.exec('aws configure get region'));

sh.echo(`Packaging SAM resources for "${BUCKET_NAME}"`);
sh.exec(
   `sam package --s3-bucket s3://${BUCKET_NAME}-sam-code --profile ${AWS_CLI_PROFILE} --region ${region}`
);