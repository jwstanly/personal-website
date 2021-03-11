const env = {
   production: {
      REACT_APP_ENV: 'PRODUCTION',
      REACT_APP_ClientUrl: 'www.YourWebsite.com',
      AWS_CLI_PROFILE: 'default',
      AWS_REGION: 'us-east-1',
      BUCKET_NAME: 'YourWebsite.com',
      ACM_CERT_ARN: 'YourACMCertificateARN',
      CF_DISTRIBUTION_ID: 'YourCloudFrontDistributionID',
   },
   local: {
      REACT_APP_ENV: 'LOCAL',
      REACT_APP_ClientUrl: 'http://localhost:3000',
      AWS_CLI_PROFILE: 'default',
   },
};

module.exports = env;