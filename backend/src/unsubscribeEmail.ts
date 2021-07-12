import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { HttpMethod } from '../../lib/enums';
import { ServiceParams, UnsubscribeEmailQueryParams } from '../../lib/Types';
import createHandler from '../lib/createHandler';

const { BLOG_TABLE } = process.env;

const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.DELETE,
    queryParamType: 'UnsubscribeEmailQueryParams',
    service,
  });
}

export async function service({
  queryParams,
}: ServiceParams<UnsubscribeEmailQueryParams, null>) {
  const { title, commentId, email } = queryParams;

  // retrieve the entire article and find the index of the comment...
  const articleRes = await docClient
    .get({
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
      },
    })
    .promise();

  // find root comment to delete email from
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex(({ id }) => id === commentId)
    : undefined;

  // user was the root comment; delete email from root comment
  if (rootCommentIndex >= 0) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
      },
      ReturnValues: 'NONE',
      UpdateExpression: `REMOVE #comments[${rootCommentIndex}].#user.email`,
      ConditionExpression: `#comments[${rootCommentIndex}].id = :commentId AND #comments[${rootCommentIndex}].#user.email = :email`,
      ExpressionAttributeNames: {
        '#comments': 'comments',
        '#user': 'user',
      },
      ExpressionAttributeValues: {
        ':commentId': commentId,
        ':email': email,
      },
    };

    const res = await docClient.update(params).promise();
    return res;
  } else {
    // user was from a reply comment; delete email from reply comment in root comment

    let replyRootCommentIndex = -2;
    let replyCommentIndex;
    for (let i = 0; i < articleRes.Item.comments.length; i++) {
      if (articleRes.Item.comments[i].replies) {
        replyCommentIndex = articleRes.Item.comments[i].replies.findIndex(
          ({ id }) => id === commentId,
        );
        if (replyCommentIndex >= 0) {
          replyRootCommentIndex = i;
          break;
        }
      }
    }

    const params: DocumentClient.UpdateItemInput = {
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
      },
      ReturnValues: 'NONE',
      UpdateExpression: `REMOVE #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email`,
      ConditionExpression: `#comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId AND #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email = :email`,
      ExpressionAttributeNames: {
        '#comments': 'comments',
        '#user': 'user',
      },
      ExpressionAttributeValues: {
        ':replyCommentId': commentId,
        ':email': email,
      },
    };

    const res = await docClient.update(params).promise();
    return res;
  }
}
