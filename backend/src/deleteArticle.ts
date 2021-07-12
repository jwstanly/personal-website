import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import serializeTitle from '../../lib/serializeTitle';
import { BlogArticle, TitleQueryParam } from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod, ServiceParams } from '../lib/createHandler';
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
  const params: DocumentClient.DeleteItemInput = {
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: `BlogArticle|${serializeTitle(queryParams.title)}`,
    },
  };

  return await docClient.delete(params).promise();
}
