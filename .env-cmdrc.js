const env = {
   production: {
      REACT_APP_ENV: 'PRODUCTION',
      REACT_APP_ClientUrl: 'www.jwstanly.com',
      BUCKET_NAME: 'jwstanly-bucket',
      ACM_CERT_ARN: 'update_me',
      CF_DISTRIBUTION_ID: '',
   },
   local: {
      REACT_APP_ENV: 'LOCAL',
      REACT_APP_ClientUrl: 'http://localhost:3000'
   },
};

module.exports = env;