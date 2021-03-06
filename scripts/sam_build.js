const sh = require('shelljs');

const {
  AWS_CLI_PROFILE,
  DOMAIN_NAME,
  EMAIL_ADDRESS,
  ACM_CERT_ARN,
  DEBUG_MODE,
} = process.env;

sh.echo(`Building SAM resources for "${DOMAIN_NAME}"`);
sh.exec(
  'sam build ' +
    '--parameter-overrides ' +
    `DomainName=${DOMAIN_NAME} ` +
    `EmailAddress=${EMAIL_ADDRESS} ` +
    `AcmCertificateArn=${ACM_CERT_ARN} ` +
    `DebugMode=${DEBUG_MODE} ` +
    '--template-file ./backend/template.yml ' +
    `--profile ${AWS_CLI_PROFILE} `,
);
