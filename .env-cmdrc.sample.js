const env = {
  production: {
    ENV_NAME: 'PRODUCTION',
    AWS_CLI_PROFILE: 'default',
    DOMAIN_NAME: 'YourWebsite.com',
    EMAIL_ADDRESS: 'yourPersonalEmail@email.com',
    ACM_CERT_ARN: 'YourACMCertificateARN',
    CF_DISTRIBUTION_ID: 'YourCloudFrontDistributionID',
    API_KEY: 'YourAPIKey',
    GOOGLE_ANALYTICS_MEASUREMENT_ID: 'YourGaIdHere',
    GOOGLE_ADSENSE_CLIENT_ID: 'YourAdsenseClientIdHere',
    DEBUG_MODE: false,
  },
  local: {
    ENV_NAME: 'LOCAL',
    AWS_CLI_PROFILE: 'default',
    DEBUG_MODE: true,
  },
};

module.exports = env;
