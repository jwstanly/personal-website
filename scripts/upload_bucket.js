const sh = require('shelljs');
const { AWS_CLI_PROFILE, AWS_REGION, REACT_APP_ENV, BUCKET_NAME, CF_DISTRIBUTION_ID } = process.env;

const bucket = BUCKET_NAME;
const distribution = CF_DISTRIBUTION_ID;
const region = AWS_REGION ? AWS_REGION : String(shell.exec('aws configure get region'));

sh.echo(`Deploying the ${REACT_APP_ENV} build to Bucket ${bucket}`);
sh.exec(`aws s3 sync out s3://${bucket} --delete --profile ${AWS_CLI_PROFILE}`);

if (distribution) {
   sh.exec(`aws cloudfront create-invalidation --distribution-id ${distribution} --paths "/*" --profile ${AWS_CLI_PROFILE} --region ${region}`);
}