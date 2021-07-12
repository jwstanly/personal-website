import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import serializeTitle from '../../lib/serializeTitle';
import { DeleteCommentReplyQueryParams } from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod, ServiceParams } from '../lib/createHandler';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.DELETE,
    queryParamType: 'DeleteCommentReplyQueryParams',
    service,
  });
}

export async function service({
  queryParams,
}: ServiceParams<DeleteCommentReplyQueryParams, null>) {
  const { title, rootCommentId, replyCommentId } = queryParams;

  // first retrieve the entire article and find the index of the root comment and reply...
  const articleRes = await docClient
    .get({
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: `BlogArticle|${serializeTitle(title)}`,
      },
    })
    .promise();

  if (!articleRes.Item) {
    throw new ApiException({
      statusCode: 404,
      res: 'No article found to delete comment reply from',
    });
  }

  const rootComment = articleRes.Item.comments
    ? articleRes.Item.comments.find(({ id }) => id === rootCommentId)
    : undefined;
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex(({ id }) => id === rootCommentId)
    : -1;

  if (rootCommentIndex === -1) {
    throw new ApiException({
      statusCode: 404,
      res: 'No root comment found to delete reply from',
    });
  }

  const replyCommentIndex = rootComment.replies.findIndex(
    ({ id }) => id === replyCommentId,
  );

  if (replyCommentIndex === -1) {
    throw new ApiException({
      statusCode: 404,
      res: 'No reply comment found to delete from root comment',
    });
  }

  // ...then using the index to delete that element from the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
    },
    ReturnValues: 'NONE',
    UpdateExpression: `REMOVE #comments[${rootCommentIndex}].replies[${replyCommentIndex}]`,
    ConditionExpression: `#comments[${rootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId`,
    ExpressionAttributeNames: {
      '#comments': 'comments',
    },
    ExpressionAttributeValues: {
      ':replyCommentId': replyCommentId,
    },
  };

  return await docClient.update(params).promise();
}
