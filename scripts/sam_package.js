const sh = require('shelljs');
const { AWS_CLI_PROFILE, BUCKET_NAME } = process.env;

/*
Create an S3 Bucket and CloudFront Distribution that serves up a React app at a custom domain
*/
(function() {
   sh.echo(`Packaging a Bucket and SAM distribution hosted at "${BUCKET_NAME}"`);
   sh.exec(
      `sam package --s3-bucket s3://${BUCKET_NAME}-sam-code --profile ${AWS_CLI_PROFILE}`
   );
})();