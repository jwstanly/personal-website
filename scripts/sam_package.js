const sh = require('shelljs');

const { 
   AWS_CLI_PROFILE, 
   DOMAIN_NAME
} = process.env;

sh.echo(`Packaging SAM resources for "${DOMAIN_NAME}"`);
sh.exec(
   'sam package ' 
   + `--s3-bucket s3://${DOMAIN_NAME}-sam-code `
   + `--profile ${AWS_CLI_PROFILE} `
);