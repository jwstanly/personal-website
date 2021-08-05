const input = require('prompt-sync')();
const fs = require('fs');
const fetch = require('node-fetch');
const { spawn } = require('child_process');

const { DOMAIN_NAME, API_KEY } = process.env;
const TAG_DELIMITER = ', ';

async function publishArticle() {
  console.log('Publish a new blog article');

  const title = input('Title: ');

  // Grab the article's data if the article already exists
  const currentArticle = await fetch(
    `https://api.${DOMAIN_NAME}/blog?title=${title.split(' ').join('+')}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    },
  )
    .then(res => res.json())
    .catch(() => {});

  const subheader = input(
    `Subheader${currentArticle ? ` [${currentArticle.subheader}]` : ''}: `,
  );
  const image = input(
    `Image${currentArticle ? ` [${currentArticle.image}]` : ''}: `,
  );
  const tags = input(
    `Tags (split by \`${TAG_DELIMITER}\`)${
      currentArticle ? ` [${currentArticle.tags.join(TAG_DELIMITER)}]` : ''
    }: `,
  );

  const contentsFile = input('Contents file [./edit.md]: ');

  const contents = fs.readFileSync(
    contentsFile.length ? contentsFile : './edit.md',
    'utf8',
  );

  const newArticle = {
    title: title.split('+').join(' '),
    subheader: subheader.length ? subheader : currentArticle.subheader,
    image: image.length ? image : currentArticle.image,
    tags: tags.length ? tags.split(TAG_DELIMITER) : currentArticle.tags,
    content: contents,
  };

  console.log('Article JSON:\n', newArticle);
  const publishConfirm = input('Publish? [Y/n]: ');

  if (publishConfirm === 'n' || publishConfirm === 'N') {
    console.log('Publish cancelled');
    process.exit(0);
  }

  console.log('Publishing...');

  await fetch(
    `https://api.${DOMAIN_NAME}/blog?title=${title.split(' ').join('+')}`,
    {
      headers: {
        Accept: 'application/json',
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newArticle),
    },
  )
    .then(res => {
      console.log('SUCCESS: Blog article published');
    })
    .catch(error => {
      console.log('ERROR: Failed to publish blog article:\n', error);
    });

  const deployFrontend = input('Deploy frontend? [Y/n]: ');

  if (deployFrontend === 'n' || deployFrontend === 'N') {
    console.log('Frontend not deployed');
    process.exit(0);
  }

  const deployment = spawn('yarn', ['deploy:frontend']);

  deployment.stdout.on('data', data => {
    console.log(data.toString());
  });

  deployment.on('exit', code => {
    console.log('SUCCESS: New frontend deployaed');
  });
}

publishArticle();
