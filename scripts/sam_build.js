const sh = require('shelljs');

const { 
   AWS_CLI_PROFILE, 
   BUCKET_NAME, 
   ACM_CERT_ARN, 
} = process.env;

sh.echo(`Building SAM resources for "${BUCKET_NAME}"`);
sh.exec(
   'sam build '
   + '--parameter-overrides '
      + `DomainName=${BUCKET_NAME} `
      + `AcmCertificateArn=${ACM_CERT_ARN} `
   + `--profile ${AWS_CLI_PROFILE} `
);