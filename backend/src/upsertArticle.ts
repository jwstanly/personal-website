import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { BlogArticle, TitleQueryParam } from '../../lib/Types';
import createHandler, { HttpMethod, ServiceParams } from '../lib/createHandler';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.POST,
    queryParamType: 'TitleQueryParam',
    bodyParamType: 'BlogArticle',
    service,
  });
}

export async function service({
  queryParams,
  body: inputArticle,
}: ServiceParams<TitleQueryParam, BlogArticle>) {
  const existingArticleRes = await docClient
    .get({
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: `BlogArticle|${queryParams.title.split(' ').join('+')}`,
      },
    })
    .promise();

  const existingArticle: BlogArticle = existingArticleRes.Item as BlogArticle;

  const outputArticle: BlogArticle = {
    ...inputArticle,
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
  };

  const params: DocumentClient.PutItemInput = {
    TableName: BLOG_TABLE,
    Item: {
      PartitionKey: `BlogArticle|${queryParams.title.split(' ').join('+')}`,
      ...outputArticle,
    },
    ReturnValues: 'NONE',
  };

  return await docClient.put(params).promise();
}
