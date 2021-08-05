const input = require('prompt-sync')();
const fs = require('fs');
const fetch = require('node-fetch');

const { DOMAIN_NAME, API_KEY } = process.env;

console.log('Get blog article');

const title = input('Title: ');
const contentsFile = input('Ouput contents file [./edit.md]: ');

console.log('Fetching article...');

fetch(`https://api.${DOMAIN_NAME}/blog?title=${title.split(' ').join('+')}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(res => {
    fs.writeFileSync(
      contentsFile.length ? contentsFile : './edit.md',
      res.content,
    );
    console.log(
      `SUCCESS: ${title} was fetched to ${
        contentsFile.length ? contentsFile : './edit.md'
      }`,
    );
  })
  .catch(error => {
    console.log('ERROR: Failed to publish blog article:\n', error);
  });
