import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import { BlogPost } from "../../lib/Types";

const blogTable = process.env.SAMPLE_TABLE

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const common = require('./util/common');

const docClient = new dynamodb.DocumentClient();


export const getArticle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`Must call getArticle with GET, not: ${event.httpMethod}`);
  }
  
  const { urlEncodedTitle } = event.queryStringParameters;
  
  if (!urlEncodedTitle) {
    throw new Error(`No urlEncodedTitle included in the query parameters`);
  }

  const params = {
    TableName: blogTable,
    KeyConditionExpression: 'PartitionKey = :hashkey',
    Limit: 1,
    ExpressionAttributeValues: {
      ':hashkey': `BlogArticle|${urlEncodedTitle}`
    }
  }

  const article: BlogPost = await docClient.query(params).promise();

  const response = common.getHeaders({
    body: JSON.stringify(article)
  })

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}


export const upsertArticle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`Must call upsertArticle with POST, not: ${event.httpMethod}`)
  }

  const articleSubmission: BlogPost = JSON.parse(event.body);

  const errorMessages: string[] = [];
  if(!articleSubmission) errorMessages.push('No article uploaded');
  if(!articleSubmission.title) errorMessages.push('No article title uploaded');
  if(!articleSubmission.urlEncodedTitle) errorMessages.push('No article URL encoded title uploaded');
  if(!articleSubmission.subheader) errorMessages.push('No article subheader uploaded');
  if(!articleSubmission.tags) errorMessages.push('No article tags uploaded');
  if(!articleSubmission.content) errorMessages.push('No article content uploaded');
  
  if (errorMessages.length !== 0) {
    const errorResponse = {
      statusCode: 400,
      body: JSON.stringify({ message: errorMessages.join(' ') })
    };
    console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} body: ${errorResponse.body}`);
    return errorResponse;
  }

  const article: BlogPost = {
    id: articleSubmission.id || (String)(Date.now()),
    createdAt: articleSubmission.createdAt || Date.now(),
    lastModifiedAt: articleSubmission.lastModifiedAt || Date.now(),
    ...articleSubmission
  }

  const params = {
    TableName: blogTable,
    Item: {
      PartitionKey: `BlogArticle|${article.urlEncodedTitle}`,
      ...article,
    }
  }

  const res = await docClient.put(params).promise();

  
  const response = common.getHeaders({
    body: JSON.stringify(res)
  })

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`)
  return response;
}
