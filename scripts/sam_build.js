const sh = require('shelljs');

const { 
   AWS_CLI_PROFILE, 
   DOMAIN_NAME, 
   ACM_CERT_ARN, 
} = process.env;

sh.echo(`Building SAM resources for "${DOMAIN_NAME}"`);
sh.exec(
   'sam build '
   + '--parameter-overrides '
      + `DomainName=${DOMAIN_NAME} `
      + `AcmCertificateArn=${ACM_CERT_ARN} `
   + `--profile ${AWS_CLI_PROFILE} `
);