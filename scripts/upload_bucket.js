const sh = require('shelljs');
const { 
   AWS_CLI_PROFILE, 
   ENV_NAME, 
   DOMAIN_NAME, 
   CF_DISTRIBUTION_ID 
} = process.env;

sh.echo(`Deploying the ${ENV_NAME} build to Bucket ${DOMAIN_NAME}`);

sh.exec(
   `aws s3 sync out s3://${DOMAIN_NAME} ` 
   + '--delete ' 
   + `--profile ${AWS_CLI_PROFILE} `
);

if (CF_DISTRIBUTION_ID) {
   sh.echo('\n');
   sh.exec(
      'aws cloudfront create-invalidation '
      + `--distribution-id ${CF_DISTRIBUTION_ID} ` 
      + '--paths "/*" '
      + `--profile ${AWS_CLI_PROFILE} `
   );
}