import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { BlogArticle, ServiceParams, TitleQueryParam } from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod } from '../lib/createHandler';
import getKeyByArticleTitle from '../lib/getKeyByArticleTitle';
import stripEmails from '../lib/stripEmails';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.GET,
    queryParamType: 'TitleQueryParam',
    service,
  });
}

export async function service({
  queryParams,
}: ServiceParams<TitleQueryParam, null>) {
  const params = {
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: getKeyByArticleTitle(queryParams.title),
    },
  };

  const articleRes = await docClient.get(params).promise();

  if (Object.keys(articleRes).length === 0) {
    throw new ApiException({
      statusCode: 404,
      res: 'No articles found',
    });
  }

  // strip emails from response so they can't be snooped client-side
  stripEmails(articleRes.Item as BlogArticle);

  return articleRes.Item as BlogArticle;
}
