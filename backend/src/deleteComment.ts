import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import serializeTitle from '../../lib/serializeTitle';
import { DeleteCommentQueryParams, ServiceParams } from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod } from '../lib/createHandler';
import getKeyByArticleTitle from '../lib/getKeyByArticleTitle';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.DELETE,
    queryParamType: 'DeleteCommentQueryParams',
    service,
  });
}

export async function service({
  queryParams,
}: ServiceParams<DeleteCommentQueryParams, null>) {
  const { title, commentId } = queryParams;

  console.log(
    'bruh',
    BLOG_TABLE,
    'ddddd',
    `BlogArticle|${serializeTitle(title)}}`,
  );

  // first retrieve the entire article and find the index of the comment...
  const articleRes = await docClient
    .get({
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: getKeyByArticleTitle(title),
      },
    })
    .promise();

  if (!articleRes.Item) {
    throw new ApiException({
      statusCode: 404,
      res: 'No article found to delete comment from',
    });
  }

  const existingCommentIndex = articleRes.Item.comments.findIndex(
    ({ id }) => id === commentId,
  );

  if (existingCommentIndex === -1) {
    throw new ApiException({
      statusCode: 404,
      res: 'No comment found to delete',
    });
  }

  // ...then using the index to delete that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
    },
    ReturnValues: 'NONE',
    UpdateExpression: `REMOVE #comments[${existingCommentIndex}]`,
    ConditionExpression: `#comments[${existingCommentIndex}].id = :commentId`,
    ExpressionAttributeNames: {
      '#comments': 'comments',
    },
    ExpressionAttributeValues: {
      ':commentId': commentId,
    },
  };

  return await docClient.update(params).promise();
}
