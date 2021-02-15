const sh = require('shelljs');
const { REACT_APP_ENV, BUCKET_NAME, CF_DISTRIBUTION_ID } = process.env;

/**
 * Upload the /build folder contents to your production S3 Bucket
 */
let bucket = BUCKET_NAME,
   distribution = CF_DISTRIBUTION_ID;


(function() {
   sh.echo(`Deploying the ${REACT_APP_ENV} build to Bucket ${bucket}`);
   sh.exec(`aws s3 sync build/ s3://${bucket} --delete`);

   if (distribution) {
      sh.exec(`aws cloudfront create-invalidation --distribution-id ${distribution} --paths "/*" `);
   }
})();