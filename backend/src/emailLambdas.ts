import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import SES from 'aws-sdk/clients/ses';

import Util from './lambdaUtils';
import { ContactMessage } from '../../lib/Types';
import getEmailHtml, { EmailType } from '../../lib/getEmailHtml';

const blogTable = process.env.BLOG_TABLE;
const awsRegion = process.env.AWS_REGION;
const domainName = process.env.DOMAIN_NAME;
const myEmailAddress = process.env.EMAIL_ADDRESS;

const docClient = new DocumentClient();
const sesClient = new SES({ region: awsRegion });

export async function unsubscribeEmail(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(
      event,
      405,
      `Must call unsubscribeEmail with DELETE, not: ${event.httpMethod}`,
    );
  }

  const missingParams: string[] = [];
  if (!event.queryStringParameters.title) missingParams.push('article title');
  if (!event.queryStringParameters.commentId) missingParams.push('comment ID');
  if (!event.queryStringParameters.email) missingParams.push('email');
  if (missingParams.length) {
    return Util.getErrorRes(
      event,
      400,
      `Missing params: ${missingParams.join(', ')}`,
    );
  }

  // retrieve the entire article and find the index of the comment...
  const articleRes = await docClient
    .get({
      TableName: blogTable,
      Key: {
        PartitionKey: `BlogArticle|${event.queryStringParameters.title
          .split(' ')
          .join('+')}`,
      },
    })
    .promise();

  // find root comment to delete email from
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex(
        ({ id }) => id === event.queryStringParameters.commentId,
      )
    : undefined;

  // user was the root comment; delete email from root comment
  if (rootCommentIndex >= 0) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: blogTable,
      Key: {
        PartitionKey: `BlogArticle|${event.queryStringParameters.title
          .split(' ')
          .join('+')}`,
      },
      ReturnValues: 'NONE',
      UpdateExpression: `REMOVE #comments[${rootCommentIndex}].#user.email`,
      ConditionExpression: `#comments[${rootCommentIndex}].id = :commentId AND #comments[${rootCommentIndex}].#user.email = :email`,
      ExpressionAttributeNames: {
        '#comments': 'comments',
        '#user': 'user',
      },
      ExpressionAttributeValues: {
        ':commentId': event.queryStringParameters.commentId,
        ':email': event.queryStringParameters.email,
      },
    };

    try {
      const res = await docClient.update(params).promise();
      return Util.getSuccessRes(event, res);
    } catch (error) {
      return Util.getErrorRes(
        event,
        500,
        `A database error occurred. ${error}`,
      );
    }
  } else {
    // user was from a reply comment; delete email from reply comment in root comment

    let replyRootCommentIndex = -2;
    let replyCommentIndex;
    for (let i = 0; i < articleRes.Item.comments.length; i++) {
      if (articleRes.Item.comments[i].replies) {
        replyCommentIndex = articleRes.Item.comments[i].replies.findIndex(
          ({ id }) => id === event.queryStringParameters.commentId,
        );
        if (replyCommentIndex >= 0) {
          replyRootCommentIndex = i;
          break;
        }
      }
    }

    const params: DocumentClient.UpdateItemInput = {
      TableName: blogTable,
      Key: {
        PartitionKey: `BlogArticle|${event.queryStringParameters.title
          .split(' ')
          .join('+')}`,
      },
      ReturnValues: 'NONE',
      UpdateExpression: `REMOVE #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email`,
      ConditionExpression: `#comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId AND #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email = :email`,
      ExpressionAttributeNames: {
        '#comments': 'comments',
        '#user': 'user',
      },
      ExpressionAttributeValues: {
        ':replyCommentId': event.queryStringParameters.commentId,
        ':email': event.queryStringParameters.email,
      },
    };

    try {
      const res = await docClient.update(params).promise();
      return Util.getSuccessRes(event, res);
    } catch (error) {
      return Util.getErrorRes(
        event,
        500,
        `A database error occurred. ${error}`,
      );
    }
  }
}

export async function contact(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'POST') {
    return Util.getErrorRes(
      event,
      405,
      `Must call unsubscribeEmail with POST, not: ${event.httpMethod}`,
    );
  }

  let inputMessage: ContactMessage;

  try {
    inputMessage = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(
      event,
      400,
      `Failed to parse JSON. Error info: ${error}`,
    );
  }

  if (!inputMessage) {
    return Util.getErrorRes(event, 400, 'No message posted');
  }

  const missingAttributes: string[] = [];
  if (!inputMessage.user || typeof inputMessage.user !== 'object')
    missingAttributes.push('user object');
  if (!inputMessage.user?.id) missingAttributes.push('user.id');
  if (!inputMessage.user?.name) missingAttributes.push('user.name');
  if (!inputMessage.user?.email) missingAttributes.push('user.email');
  if (!inputMessage.message || typeof inputMessage.message !== 'string')
    missingAttributes.push('message');

  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(
      event,
      400,
      `Missing body attributes: ${missingAttributes.join(', ')}`,
    );
  }

  console.log('received:', inputMessage);

  const emailParams: SES.SendEmailRequest = {
    Destination: {
      ToAddresses: [myEmailAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: getEmailHtml({
            domainName: domainName,
            type: EmailType.Contact,
            contactInfo: {
              inputMessage: inputMessage,
            },
          }),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data:
          inputMessage.subject ||
          `${inputMessage.user.name} has contacted you from ${domainName}`,
      },
    },
    Source: `contact@${domainName}`,
  };

  try {
    const res = await sesClient.sendEmail(emailParams).promise();
    return Util.getSuccessRes(event, res);
  } catch (error) {
    return Util.getErrorRes(event, 500, `An email error occurred. ${error}`);
  }
}
