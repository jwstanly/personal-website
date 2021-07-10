const sh = require('shelljs');

const { AWS_CLI_PROFILE, DOMAIN_NAME, ACM_CERT_ARN } = process.env;

function getStackStatus(stackStdout) {
  const startIndex = stackStdout.indexOf('StackStatus');
  const endIndex = stackStdout
    .substring(SesCfStack.indexOf('StackStatus'))
    .indexOf('\n');
  const keyValuePair = stackStdout.substring(startIndex, endIndex + startIndex);
  return keyValuePair.split(': ')[1];
}

sh.echo(`Deploying resources for "${DOMAIN_NAME}"`);

if (!sh.which('aws') || !sh.which('sam')) {
  sh.echo(
    'You must install both the AWS CLI and the AWS Serverless Application Model (SAM) CLI to run this script',
  );
  sh.exit(1);
}

if (!sh.which('git')) {
  sh.echo(
    'You must install git to clone the repo for making custom resources for AWS SES',
  );
  sh.exit(1);
}

const SesCfStack = sh.exec(
  'aws cloudformation describe-stacks ' +
    `--stack-name ${DOMAIN_NAME.split('.')[0]}-auto-managed-cfn-ses-provider ` +
    `--profile ${AWS_CLI_PROFILE} `,
  { silent: true },
).stdout;

if (getStackStatus(SesCfStack) !== 'CREATE_COMPLETE') {
  // Create the custom CloudFormation SES provider if the user doesn't already have one
  // Huge thanks to Binx for making this provider https://github.com/binxio/cfn-ses-provider

  sh.echo(
    'Downloading CloudFormation custom providers for handle AWS SES domain configuration',
  );

  if (!sh.test('-d', 'cfn-ses-provider')) {
    sh.exec('git clone https://github.com/binxio/cfn-ses-provider.git');
  }

  sh.exec(
    'aws cloudformation deploy ' +
      '--capabilities CAPABILITY_IAM ' +
      `--stack-name ${
        DOMAIN_NAME.split('.')[0]
      }-auto-managed-cfn-ses-provider ` +
      '--template-file ./cfn-ses-provider/cloudformation/cfn-resource-provider.yaml ' +
      `--profile ${AWS_CLI_PROFILE} `,
  );

  sh.rm('-rf', 'cfn-ses-provider');
}

sh.exec(
  'sam deploy ' +
    `--stack-name ${DOMAIN_NAME.split('.')[0]}-website ` +
    '--parameter-overrides ' +
    `DomainName=${DOMAIN_NAME} ` +
    `AcmCertificateArn=${ACM_CERT_ARN} ` +
    '--resolve-s3 ' +
    '--capabilities CAPABILITY_IAM ' +
    '--template-file ./backend/template.yml ' +
    `--profile ${AWS_CLI_PROFILE} `,
);
