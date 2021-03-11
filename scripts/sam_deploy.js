const sh = require('shelljs');

const { AWS_CLI_PROFILE, BUCKET_NAME, ACM_CERT_ARN, AWS_REGION } = process.env;
const region = AWS_REGION ? AWS_REGION : String(shell.exec('aws configure get region'));

sh.echo(`Deploying resources for "${BUCKET_NAME}"`);
sh.exec(
   `sam deploy --stack-name jwstanly-website --parameter-overrides DomainName=${BUCKET_NAME} AcmCertificateArn=${ACM_CERT_ARN} AWSRegion=${region} --resolve-s3 --capabilities CAPABILITY_IAM --profile ${AWS_CLI_PROFILE} --region ${region}`
);