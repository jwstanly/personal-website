import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  BlogArticle,
  BlogComment,
  BlogCommentSubmit,
  BlogUser,
  TitleQueryParam,
} from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod, ServiceParams } from '../lib/createHandler';
import getKeyByArticleTitle from '../lib/getKeyByArticleTitle';
import stripEmails from '../lib/stripEmails';

const { BLOG_TABLE } = process.env;
const docClient = new DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.POST,
    queryParamType: 'TitleQueryParam',
    bodyParamType: 'BlogCommentSubmit',
    service,
  });
}

export async function service({
  queryParams,
  body: inputComment,
}: ServiceParams<TitleQueryParam, BlogCommentSubmit>) {
  if (inputComment.comment.length > 2000) {
    throw new ApiException({
      statusCode: 400,
      res: `Comments must be under 2000 characters. Comment length submitted: ${inputComment.comment.length}`,
    });
  }

  // first retrieve the entire article and find the index of the comment...
  const articleRes = await docClient
    .get({
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: getKeyByArticleTitle(queryParams.title),
      },
    })
    .promise();

  const existingComment = articleRes.Item.comments
    ? articleRes.Item.comments.find(({ id }) => id === inputComment.id)
    : undefined;
  const existingCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex(({ id }) => id === inputComment.id)
    : -1;

  // preserve email across edits (client-side never gets email back to edit)
  const outputUser: BlogUser = inputComment.user;
  if (
    !inputComment.user.email &&
    existingComment &&
    existingComment.user &&
    existingComment.user.email
  ) {
    outputUser.email = existingComment.user.email;
  }

  const outputComment: BlogComment = {
    ...inputComment,
    user: outputUser,
    id: inputComment.id || String(Date.now()),
    createdAt: existingComment
      ? existingComment.createdAt
      : inputComment.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
    replies: existingComment
      ? existingComment.replies
      : inputComment.replies || [],
  };

  // ...then using the index to upsert that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: getKeyByArticleTitle(queryParams.title),
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression:
      existingCommentIndex === -1
        ? 'SET #comments = list_append(if_not_exists(#comments, :newList), :blogComment)'
        : `SET #comments[${existingCommentIndex}] = :blogComment`,
    ExpressionAttributeNames: {
      '#comments': 'comments',
    },
    ExpressionAttributeValues:
      existingCommentIndex === -1
        ? { ':blogComment': [outputComment], ':newList': [] }
        : { ':blogComment': outputComment },
  };

  const res = await docClient.update(params).promise();

  // strip emails from response so they can't be snooped client-side
  stripEmails(res.Attributes as BlogArticle);

  return res;
}
