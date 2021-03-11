const sh = require('shelljs');

const { AWS_CLI_PROFILE, BUCKET_NAME, ACM_CERT_ARN, AWS_REGION } = process.env;
const region = AWS_REGION ? AWS_REGION : String(shell.exec('aws configure get region'));

sh.echo(`Building SAM resources for "${BUCKET_NAME}"`);
sh.exec(
   `sam build --parameter-overrides DomainName=${BUCKET_NAME} AcmCertificateArn=${ACM_CERT_ARN} AWSRegion=${region} --profile ${AWS_CLI_PROFILE} --region ${region}`
);