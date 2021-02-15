const sh = require('shelljs');
const { BUCKET_NAME, ACM_CERT_ARN } = process.env;

/*
Create an S3 Bucket and CloudFront Distribution that serves up a React app at a custom domain
*/
(function() {
   sh.echo(`Deploying a Bucket and SAM distribution hosted at "${BUCKET_NAME}"`);
   sh.exec(
      `sam deploy --template-file ./template.yml --stack-name jwstanly-website --parameter-overrides DomainName=${BUCKET_NAME} FullDomainName=www.${BUCKET_NAME} AcmCertificateArn=${ACM_CERT_ARN}`
   );
})();