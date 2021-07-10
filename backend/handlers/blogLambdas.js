'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteArticle =
  exports.upsertArticle =
  exports.getArticleByTitle =
  exports.getAllArticles =
    void 0;
const dynamodb_1 = require('aws-sdk/clients/dynamodb');
const lambdaUtils_1 = __importDefault(require('./lambdaUtils'));
const blogTable = process.env.BLOG_TABLE;
const docClient = new dynamodb_1.DocumentClient();
async function getAllArticles(event) {
  if (event.httpMethod !== 'GET') {
    return lambdaUtils_1.default.getErrorRes(
      event,
      405,
      `Must call getAllArticles with GET, not: ${event.httpMethod}`,
    );
  }
  const params = {
    TableName: blogTable,
  };
  const articlesRes = await docClient.scan(params).promise();
  if (!articlesRes.Items || Object.keys(articlesRes.Items).length === 0) {
    return lambdaUtils_1.default.getErrorRes(event, 404, 'No articles found');
  }
  // strip emails from response so they can't be snooped client-side
  articlesRes.Items.forEach(lambdaUtils_1.default.stripEmails);
  console.info(
    `params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(
      articlesRes,
    )}`,
  );
  return lambdaUtils_1.default.getSuccessRes(event, articlesRes);
}
exports.getAllArticles = getAllArticles;
async function getArticleByTitle(event) {
  if (event.httpMethod !== 'GET') {
    return lambdaUtils_1.default.getErrorRes(
      event,
      405,
      `Must call getArticle with GET, not: ${event.httpMethod}`,
    );
  }
  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return lambdaUtils_1.default.getErrorRes(
      event,
      400,
      'Missing param: title',
    );
  }
  const { title } = event.queryStringParameters;
  const params = {
    TableName: blogTable,
    Key: {
      PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
    },
  };
  const articleRes = await docClient.get(params).promise();
  if (Object.keys(articleRes).length === 0) {
    return lambdaUtils_1.default.getErrorRes(event, 404, 'No article found');
  }
  // strip emails from response so they can't be snooped client-side
  lambdaUtils_1.default.stripEmails(articleRes.Item);
  console.info(
    `params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(
      articleRes,
    )}`,
  );
  return lambdaUtils_1.default.getSuccessRes(event, articleRes);
}
exports.getArticleByTitle = getArticleByTitle;
async function upsertArticle(event) {
  if (event.httpMethod !== 'POST') {
    return lambdaUtils_1.default.getErrorRes(
      event,
      405,
      `Must call upsertArticle with POST, not: ${event.httpMethod}`,
    );
  }
  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return lambdaUtils_1.default.getErrorRes(
      event,
      400,
      'Missing param: title',
    );
  }
  let inputArticle;
  try {
    inputArticle = JSON.parse(event.body);
  } catch (error) {
    return lambdaUtils_1.default.getErrorRes(
      event,
      400,
      `Failed to parse JSON. Error info: ${error}`,
    );
  }
  if (!inputArticle) {
    return lambdaUtils_1.default.getErrorRes(event, 400, 'No article posted');
  }
  const missingAttributes = [];
  if (!inputArticle.title) missingAttributes.push('title');
  if (!inputArticle.subheader) missingAttributes.push('subheader');
  if (!inputArticle.tags) missingAttributes.push('tags');
  if (!inputArticle.content) missingAttributes.push('content');
  if (missingAttributes.length !== 0) {
    return lambdaUtils_1.default.getErrorRes(
      event,
      400,
      `Missing body attributes: ${missingAttributes.join(', ')}`,
    );
  }
  const existingArticleRes = await docClient
    .get({
      TableName: blogTable,
      Key: {
        PartitionKey: `BlogArticle|${event.queryStringParameters.title
          .split(' ')
          .join('+')}`,
      },
    })
    .promise();
  const existingArticle = existingArticleRes.Item;
  const outputArticle = Object.assign(Object.assign({}, inputArticle), {
    id: inputArticle.id || String(Date.now()),
    createdAt: existingArticle
      ? existingArticle.createdAt
      : inputArticle.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
    comments: inputArticle.comments
      ? inputArticle.comments
      : existingArticle && existingArticle.comments
      ? existingArticle.comments
      : [],
    votes: inputArticle.votes
      ? inputArticle.votes
      : existingArticle && existingArticle.votes
      ? existingArticle.votes
      : [],
  });
  const params = {
    TableName: blogTable,
    Item: Object.assign(
      {
        PartitionKey: `BlogArticle|${event.queryStringParameters.title
          .split(' ')
          .join('+')}`,
      },
      outputArticle,
    ),
    ReturnValues: 'NONE',
  };
  const res = await docClient.put(params).promise();
  return lambdaUtils_1.default.getSuccessRes(event, res);
}
exports.upsertArticle = upsertArticle;
async function deleteArticle(event) {
  if (event.httpMethod !== 'DELETE') {
    return lambdaUtils_1.default.getErrorRes(
      event,
      405,
      `Must call deleteArticle with DELETE, not: ${event.httpMethod}`,
    );
  }
  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return lambdaUtils_1.default.getErrorRes(
      event,
      400,
      'Missing param: title',
    );
  }
  const { title } = event.queryStringParameters;
  const params = {
    TableName: blogTable,
    Key: {
      PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
    },
  };
  const res = await docClient.delete(params).promise();
  return lambdaUtils_1.default.getSuccessRes(event, res);
}
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=blogLambdas.js.map
