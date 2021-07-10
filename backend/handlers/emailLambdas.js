'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.unsubscribeEmail = void 0;
const dynamodb_1 = require('aws-sdk/clients/dynamodb');
const ses_1 = __importDefault(require('aws-sdk/clients/ses'));
const lambdaUtils_1 = __importDefault(require('./lambdaUtils'));
const blogTable = process.env.BLOG_TABLE;
const awsRegion = process.env.AWS_REGION;
const domainName = process.env.DOMAIN_NAME;
const docClient = new dynamodb_1.DocumentClient();
const ses = new ses_1.default({ region: awsRegion });
async function unsubscribeEmail(event) {
  if (event.httpMethod !== 'DELETE') {
    return lambdaUtils_1.default.getErrorRes(
      event,
      405,
      `Must call unsubscribeEmail with DELETE, not: ${event.httpMethod}`,
    );
  }
  const missingParams = [];
  if (!event.queryStringParameters.title) missingParams.push('article title');
  if (!event.queryStringParameters.commentId) missingParams.push('comment ID');
  if (!event.queryStringParameters.email) missingParams.push('email');
  if (missingParams.length) {
    return lambdaUtils_1.default.getErrorRes(
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
    const params = {
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
      return lambdaUtils_1.default.getSuccessRes(event, res);
    } catch (error) {
      return lambdaUtils_1.default.getErrorRes(
        event,
        500,
        `A database error occured. ${error}`,
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
    const params = {
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
      return lambdaUtils_1.default.getSuccessRes(event, res);
    } catch (error) {
      return lambdaUtils_1.default.getErrorRes(
        event,
        500,
        `A database error occured. ${error}`,
      );
    }
  }
}
exports.unsubscribeEmail = unsubscribeEmail;
//# sourceMappingURL=emailLambdas.js.map
