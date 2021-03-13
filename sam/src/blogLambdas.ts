import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import dynamodb from 'aws-sdk/clients/dynamodb';
import Util, { BlogArticle } from './lambdaUtils';

const blogTable = process.env.BLOG_TABLE;
const docClient = new dynamodb.DocumentClient();

export async function getAllArticles(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'GET') {
    return Util.getErrorRes(event, 405, `Must call getAllArticles with GET, not: ${event.httpMethod}`);
  }

  const params: dynamodb.DocumentClient.ScanInput = {
    TableName: blogTable,
  }

  const articlesRes = await docClient.scan(params).promise();

  if (Object.keys(articlesRes).length === 0) {
    return Util.getErrorRes(event, 404, "No articles found");
  }

  console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articlesRes)}`);

  return Util.getSuccessRes(event, articlesRes);
}

export const getArticleByTitle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

  console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articleRes)}`);

  return Util.getSuccessRes(event, articleRes);
}


export const upsertArticle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    return Util.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
  }

  let articleSubmission: BlogArticle;

  try {
    articleSubmission = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
  }

  if (!articleSubmission) {
    return Util.getErrorRes(event, 400, 'No article posted');
  }

  const missingAttributes: string[] = [];
  if(!articleSubmission.title) missingAttributes.push('title');
  if(!articleSubmission.subheader) missingAttributes.push('subheader');
  if(!articleSubmission.tags) missingAttributes.push('tags');
  if(!articleSubmission.content) missingAttributes.push('content');
  
  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing attributes: ${missingAttributes.join(', ')}`);
  }

  const article: BlogArticle = {
    id: articleSubmission.id || (String)(Date.now()),
    createdAt: articleSubmission.createdAt || Date.now(),
    lastModifiedAt: articleSubmission.lastModifiedAt || Date.now(),
    ...articleSubmission
  }

  const params = {
    TableName: blogTable,
    Item: {
      "PartitionKey": `BlogArticle|${article.title.split(' ').join('+')}`,
      ...article,
    }
  }

  const res = await docClient.put(params).promise();

  
  return Util.getSuccessRes(event, res);
}

export const deleteArticle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return Util.getErrorRes(event, 400, "Missing param: title");
  }

  const { title } = event.queryStringParameters;

  const params = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    },
  };

  const res = await docClient.delete(params).promise();

  return Util.getSuccessRes(event, res);
}
