import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import SES from 'aws-sdk/clients/ses';

import Util from './lambdaUtils';
import { BlogComment, BlogArticle, BlogCommentReply, BlogUser } from '../../lib/Types';

const blogTable = process.env.BLOG_TABLE;
const awsRegion = process.env.AWS_REGION;
const domainName = process.env.DOMAIN_NAME;

const docClient = new DocumentClient();
const ses = new SES({region: awsRegion});


export async function unsubscribeEmail(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(event, 405, `Must call unsubscribeEmail with DELETE, not: ${event.httpMethod}`);
  }

  const missingParams: string[] = [];
  if(!event.queryStringParameters.title) missingParams.push('article title');
  if(!event.queryStringParameters.commentId) missingParams.push('comment ID');
  if (missingParams.length) {
    return Util.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
  }

  // retrieve the entire article and find the index of the comment...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    }
  }).promise();

  // find root comment to delete email from
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex( ({ id }) => id === event.queryStringParameters.commentId )
    : undefined;

  // user was the root comment; delete email from root comment
  if(rootCommentIndex >= 0) {

    const params: DocumentClient.UpdateItemInput = {
      TableName: blogTable,
      Key: {
        "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
      },
      ReturnValues: 'NONE',
      UpdateExpression: `REMOVE #comments[${rootCommentIndex}].#user.email`,
      ConditionExpression: `#comments[${rootCommentIndex}].id = :commentId`,
      ExpressionAttributeNames: {
        '#comments': 'comments',
        '#user': 'user'
      },
      ExpressionAttributeValues: {
        ":commentId": event.queryStringParameters.commentId
      }
    }

    try {
      const res = await docClient.update(params).promise();
      return Util.getSuccessRes(event, res);
    } catch (error) {
      return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
    }
  
  } else {  // user was from a reply comment; delete email from reply comment in root comment

    let replyRootCommentIndex = -2;
    let replyCommentIndex;
    for(let i = 0; i < articleRes.Item.comments.length; i++) {
      if(articleRes.Item.comments[i].replies) {
        replyCommentIndex = articleRes.Item.comments[i].replies.findIndex( ({ id }) => id === event.queryStringParameters.commentId );
        if (replyCommentIndex >= 0) {
          replyRootCommentIndex = i;
          break;
        }
      }
    }

    const params: DocumentClient.UpdateItemInput = {
      TableName: blogTable,
      Key: {
        "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
      },
      ReturnValues: 'NONE',
      UpdateExpression: `REMOVE #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email`,
      ConditionExpression: `#comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId`,
      ExpressionAttributeNames: {
        '#comments': 'comments',
        '#user': 'user'
      },
      ExpressionAttributeValues: {
        ":replyCommentId": event.queryStringParameters.commentId
      }
    }

    try {
      const res = await docClient.update(params).promise();
      return Util.getSuccessRes(event, res);
    } catch (error) {
      return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
    }
  }  
}