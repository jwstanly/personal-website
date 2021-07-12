import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { HttpMethod } from '../../lib/enums';
import { ServiceParams, TitleQueryParam } from '../../lib/Types';
import createHandler from '../lib/createHandler';
import getKeyByArticleTitle from '../lib/getKeyByArticleTitle';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.DELETE,
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
      PartitionKey: getKeyByArticleTitle(queryParams.title),
    },
  };

  return await docClient.delete(params).promise();
}
