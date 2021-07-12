import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { BlogArticle } from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod } from '../lib/createHandler';
import stripEmails from '../lib/stripEmails';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.GET,
    service,
  });
}

export async function service() {
  const params: DocumentClient.ScanInput = {
    TableName: BLOG_TABLE,
  };

  const articlesRes = await docClient.scan(params).promise();

  if (!articlesRes.Items || Object.keys(articlesRes.Items).length === 0) {
    throw new ApiException({
      statusCode: 404,
      res: 'No articles found',
    });
  }

  // strip emails from response so they can't be snooped client-side
  (articlesRes.Items as BlogArticle[]).forEach(stripEmails);

  return articlesRes.Items as BlogArticle[];
}
