const sh = require('shelljs');
const { AWS_CLI_PROFILE, ENV_NAME, DOMAIN_NAME, CF_DISTRIBUTION_ID } =
  process.env;

const excludedDirs = ['images', 'files'];
const excludedFiles = ['resume.pdf'];

sh.echo(`Deploying the ${ENV_NAME} build to Bucket ${DOMAIN_NAME}`);

sh.exec(
  `aws s3 sync out s3://${DOMAIN_NAME} ` +
    '--delete ' +
    excludedDirs.map(p => `--exclude ${p}`).join(' ') +
    ' ' +
    `--profile ${AWS_CLI_PROFILE} `,
);

for (const dir of excludedDirs) {
  sh.exec(
    `aws s3 cp out/${dir} s3://${DOMAIN_NAME}/${dir} --recursive --profile ${AWS_CLI_PROFILE} `,
  );
}

for (const path of excludedFiles) {
  sh.exec(
    `aws s3 cp out/${path} s3://${DOMAIN_NAME}/${path} --profile ${AWS_CLI_PROFILE} `,
  );
}

if (CF_DISTRIBUTION_ID) {
  sh.echo('\n');
  sh.exec(
    'aws cloudfront create-invalidation ' +
      `--distribution-id ${CF_DISTRIBUTION_ID} ` +
      '--paths "/*" ' +
      `--profile ${AWS_CLI_PROFILE} `,
  );
}
