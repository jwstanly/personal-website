import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Util from './lambdaUtils';
import { BlogArticle } from '../../lib/Types';

const blogTable = process.env.BLOG_TABLE;
const docClient = new DocumentClient();

export async function getAllArticles(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'GET') {
    return Util.getErrorRes(event, 405, `Must call getAllArticles with GET, not: ${event.httpMethod}`);
  }

  const params: DocumentClient.ScanInput = {
    TableName: blogTable,
  }

  const articlesRes = await docClient.scan(params).promise();

  if (!articlesRes.Items || Object.keys(articlesRes.Items).length === 0) {
    return Util.getErrorRes(event, 404, "No articles found");
  }

  // strip emails from response so they can't be snooped client-side
  (articlesRes.Items as BlogArticle[]).forEach(Util.stripEmails);

  console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articlesRes)}`);

  return Util.getSuccessRes(event, articlesRes);
}

export async function getArticleByTitle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'GET') {
    return Util.getErrorRes(event, 405, `Must call getArticle with GET, not: ${event.httpMethod}`);
  }
  
  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return Util.getErrorRes(event, 400, "Missing param: title");
  }

  const { title } = event.queryStringParameters;

  const params = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    }
  }

  const articleRes = await docClient.get(params).promise();

  if (Object.keys(articleRes).length === 0) {
    return Util.getErrorRes(event, 404, "No article found");
  }

  // strip emails from response so they can't be snooped client-side
  Util.stripEmails(articleRes.Item as BlogArticle);

  console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articleRes)}`);

  return Util.getSuccessRes(event, articleRes);
}


export async function upsertArticle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'POST') {
    return Util.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
  }
  
  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return Util.getErrorRes(event, 400, "Missing param: title");
  }

  let inputArticle: BlogArticle;
  try {
    inputArticle = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
  }

  if (!inputArticle) {
    return Util.getErrorRes(event, 400, 'No article posted');
  }

  const missingAttributes: string[] = [];
  if(!inputArticle.title) missingAttributes.push('title');
  if(!inputArticle.subheader) missingAttributes.push('subheader');
  if(!inputArticle.tags) missingAttributes.push('tags');
  if(!inputArticle.content) missingAttributes.push('content');
  
  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
  }

  const existingArticleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    }
  }).promise();
  const existingArticle: BlogArticle = existingArticleRes.Item as BlogArticle;

  const outputArticle: BlogArticle = {
    ...inputArticle,
    id: inputArticle.id || (String)(Date.now()),
    createdAt: existingArticle
      ? existingArticle.createdAt
      : inputArticle.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
    comments: inputArticle.comments
      ? inputArticle.comments
      : existingArticle && existingArticle.comments
        ? existingArticle.comments
        : []
  }

  const params: DocumentClient.PutItemInput = {
    TableName: blogTable,
    Item: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
      ...outputArticle,
    },
    ReturnValues: 'NONE',
  }

  const res = await docClient.put(params).promise();

  
  return Util.getSuccessRes(event, res);
}

export async function deleteArticle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return Util.getErrorRes(event, 400, "Missing param: title");
  }

  const { title } = event.queryStringParameters;

  const params: DocumentClient.DeleteItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    },
  };

  const res = await docClient.delete(params).promise();

  return Util.getSuccessRes(event, res);
}
