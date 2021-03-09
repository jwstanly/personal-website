import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import dynamodb from 'aws-sdk/clients/dynamodb';
import Util, { BlogArticle } from './lambdaUtils';

const blogTable = process.env.BLOG_TABLE;
const docClient = new dynamodb.DocumentClient();


export const getArticleByTitle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`Must call getArticle with GET, not: ${event.httpMethod}`);
  }
  
  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    const errorResponse = Util.getErrorRes(
      400,
      "Missing param: title"
    );
    console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
    return errorResponse;
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
    const errorResponse = Util.getErrorRes(
      404,
      "No article found"
    );
    console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
    return errorResponse;
  }

  console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articleRes)}`);

  const response = Util.getSuccessRes(articleRes);

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
  return response;
}


export const upsertArticle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`Must call upsertArticle with POST, not: ${event.httpMethod}`)
  }

  const articleSubmission: BlogArticle = JSON.parse(event.body);

  const missingAttributes: string[] = [];
  if(!articleSubmission) missingAttributes.push('No article uploaded');
  if(!articleSubmission.title) missingAttributes.push('title');
  if(!articleSubmission.subheader) missingAttributes.push('subheader');
  if(!articleSubmission.tags) missingAttributes.push('tags');
  if(!articleSubmission.content) missingAttributes.push('content');
  
  if (missingAttributes.length !== 0) {
    const errorResponse = Util.getErrorRes(
      400, 
      `Missing attributes: ${missingAttributes.join(', ')}`
    );
    console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
    return errorResponse;
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

  
  const response = Util.getSuccessRes(res);

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`)
  return response;
}

export const deleteArticle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`delete only accepts DELETE method, you tried: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    const errorResponse = Util.getErrorRes(
      400,
      "Missing param: title"
    );
    console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
    return errorResponse;
  }

  const { title } = event.queryStringParameters;

  const params = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    },
  };

  const res = await docClient.delete(params).promise();

  const response = Util.getSuccessRes(res);

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
  return response;
}
