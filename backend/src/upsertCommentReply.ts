import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import SES from 'aws-sdk/clients/ses';
import {
  BlogArticle,
  BlogComment,
  BlogCommentReply,
  BlogCommentReplySubmit,
  BlogUser,
  ServiceParams,
  UpsertCommentReplyQueryParams,
} from '../../lib/Types';
import ApiException from '../lib/ApiException';
import createHandler, { HttpMethod } from '../lib/createHandler';
import getEmailHtml, { EmailType } from '../lib/getEmailHtml';
import getKeyByArticleTitle from '../lib/getKeyByArticleTitle';
import stripEmails from '../lib/stripEmails';

const { BLOG_TABLE, DOMAIN_NAME, AWS_REGION } = process.env;

const docClient = new DocumentClient();
const ses = new SES({ region: AWS_REGION });

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.POST,
    queryParamType: 'UpsertCommentReplyQueryParams',
    bodyParamType: 'BlogCommentReplySubmit',
    service,
  });
}

export async function service({
  queryParams,
  body: inputCommentReply,
}: ServiceParams<UpsertCommentReplyQueryParams, BlogCommentReplySubmit>) {
  if (inputCommentReply.comment.length > 2000) {
    throw new ApiException({
      statusCode: 400,
      res: `Comments must be under 2000 characters. Comment length submitted: ${inputCommentReply.comment.length}`,
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

  const rootComment = articleRes.Item.comments
    ? articleRes.Item.comments.find(
        ({ id }) => id === queryParams.rootCommentId,
      )
    : undefined;
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex(
        ({ id }) => id === queryParams.rootCommentId,
      )
    : -1;

  if (rootCommentIndex === -1) {
    throw new ApiException({
      statusCode: 404,
      res: 'No root comment found',
    });
  }

  const repliedToComment: BlogComment | BlogCommentReply =
    rootComment.id === inputCommentReply.replyToId
      ? rootComment
      : rootComment.replies.find(
          ({ id }) => id === inputCommentReply.replyToId,
        );

  if (!repliedToComment) {
    throw new ApiException({
      statusCode: 404,
      res: 'No reply comment found',
    });
  }

  if (repliedToComment.user.email) {
    console.log('Emailing', repliedToComment.user.email);

    const emailParams: SES.SendEmailRequest = {
      Destination: {
        ToAddresses: [repliedToComment.user.email],
        BccAddresses: ['jwstanly@yahoo.com'],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Your blog comment has a response!',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: getEmailHtml({
              domainName: DOMAIN_NAME,
              type: EmailType.CommentReply,
              commentReplyInfo: {
                article: articleRes.Item as BlogArticle,
                originalComment: repliedToComment,
                commentReply: inputCommentReply,
              },
            }),
          },
        },
      },
      Source: `donotreply@${DOMAIN_NAME}`,
    };

    // Instead of throwing 500s, report errors to CloudWatch
    // Clients shouldn't experience a total failure just because the email failed
    try {
      const res = await ses.sendEmail(emailParams).promise();
      console.log('SES SUCCESS', res);
    } catch (error) {
      console.log('SES ERROR:', error);
    }
  }

  const existingCommentReply =
    rootComment.replies && inputCommentReply.id
      ? rootComment.replies.find(({ id }) => id === inputCommentReply.id)
      : undefined;
  const existingCommentReplyIndex =
    rootComment.replies && inputCommentReply.id
      ? rootComment.replies.findIndex(({ id }) => id === inputCommentReply.id)
      : -1;

  // preserve email across edits (client-side never gets email back to edit)
  const outputUser: BlogUser = inputCommentReply.user;
  if (
    !inputCommentReply.user.email &&
    existingCommentReply &&
    existingCommentReply.user &&
    existingCommentReply.user.email
  ) {
    outputUser.email = existingCommentReply.user.email;
  }

  const outputCommentReply: BlogCommentReply = {
    ...inputCommentReply,
    user: outputUser,
    id: inputCommentReply.id || String(Date.now()),
    createdAt: existingCommentReply
      ? existingCommentReply.createdAt
      : inputCommentReply.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
  };

  // ...then using the index to upsert that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: getKeyByArticleTitle(queryParams.title),
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression:
      existingCommentReplyIndex === -1
        ? `SET #comments[${rootCommentIndex}].replies = list_append(if_not_exists(#comments[${rootCommentIndex}].replies, :newList), :blogCommentReply)`
        : `SET #comments[${rootCommentIndex}].replies[${existingCommentReplyIndex}] = :blogCommentReply`,
    ExpressionAttributeNames: {
      '#comments': 'comments',
    },
    ExpressionAttributeValues:
      existingCommentReplyIndex === -1
        ? { ':blogCommentReply': [outputCommentReply], ':newList': [] }
        : { ':blogCommentReply': outputCommentReply },
  };

  const res = await docClient.update(params).promise();

  // strip emails from response so they can't be snooped client-side
  stripEmails(res.Attributes as BlogArticle);

  return res;
}
