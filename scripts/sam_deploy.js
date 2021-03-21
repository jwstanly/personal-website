const sh = require('shelljs');

const { 
   AWS_CLI_PROFILE, 
   DOMAIN_NAME, 
   ACM_CERT_ARN,
} = process.env;
  
sh.echo(`Deploying resources for "${DOMAIN_NAME}"`);
sh.exec(
   'sam deploy '
   + `--stack-name ${DOMAIN_NAME.split('.')[0]}-website `
   + '--parameter-overrides '
      + `DomainName=${DOMAIN_NAME} `
      + `AcmCertificateArn=${ACM_CERT_ARN} `
   + '--resolve-s3 '
   + '--capabilities CAPABILITY_IAM '
   + `--profile ${AWS_CLI_PROFILE} `
);