const sh = require('shelljs');

const { 
   AWS_CLI_PROFILE, 
   BUCKET_NAME, 
   ACM_CERT_ARN,
} = process.env;
  
sh.echo(`Deploying resources for "${BUCKET_NAME}"`);
sh.exec(
   'sam deploy '
   + `--stack-name jwstanly-website `
   + '--parameter-overrides '
      + `DomainName=${BUCKET_NAME} `
      + `AcmCertificateArn=${ACM_CERT_ARN} `
   + '--resolve-s3 '
   + '--capabilities CAPABILITY_IAM '
   + `--profile ${AWS_CLI_PROFILE} `
);