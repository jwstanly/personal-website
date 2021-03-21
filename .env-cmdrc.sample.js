const env = {
   production: {
      ENV_NAME: 'PRODUCTION',
      AWS_CLI_PROFILE: 'default',
      DOMAIN_NAME: 'YourWebsite.com',
      ACM_CERT_ARN: 'YourACMCertificateARN',
      CF_DISTRIBUTION_ID: 'YourCloudFrontDistributionID',
   },
   local: {
      ENV_NAME: 'LOCAL',
      AWS_CLI_PROFILE: 'default',
   },
};

module.exports = env;