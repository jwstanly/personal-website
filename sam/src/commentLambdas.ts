import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Util from './lambdaUtils';
import { BlogComment, BlogArticle, BlogCommentReply } from '../../lib/Types';

const blogTable = process.env.BLOG_TABLE;
const docClient = new DocumentClient();


export async function upsertComment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'POST') {
    return Util.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return Util.getErrorRes(event, 400, "Missing param: title");
  }

  let inputComment: BlogComment;

  try {
    inputComment = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
  }

  if (!inputComment) {
    return Util.getErrorRes(event, 400, 'No comment posted');
  }

  const missingAttributes: string[] = [];
  if(!inputComment.user || typeof inputComment.user !== "object") missingAttributes.push('user object');
  if(inputComment.user && !inputComment.user.id) missingAttributes.push('user.id');
  if(!inputComment.comment) missingAttributes.push('comment');
  
  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
  }

  if (inputComment.comment.length > 2000) {
    return Util.getErrorRes(event, 400, `Comments must be under 2000 characters. Comment length submitted: ${inputComment.comment.length}`);
  }

  // first retrieve the entire article and find the index of the comment...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    }
  }).promise();

  const existingComment = articleRes.Item.comments
    ? articleRes.Item.comments.find( ({ id }) => id === inputComment.id )
    : undefined;
  const existingCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex( ({ id }) => id === inputComment.id )
    : -1;

  const outputComment: BlogComment = {
    ...inputComment,
    id: inputComment.id || String(Date.now()),
    createdAt: existingComment 
      ? existingComment.createdAt
      : inputComment.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
  };

  // ...then using the index to upsert that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: existingCommentIndex === -1 
      ? 'SET #comments = list_append(if_not_exists(#comments, :newList), :blogComment)'
      : `SET #comments[${existingCommentIndex}] = :blogComment`,
    ExpressionAttributeNames: {
      '#comments': 'comments'
    },
    ExpressionAttributeValues: existingCommentIndex === -1 
      ? { ':blogComment': [outputComment], ':newList': [] }
      : { ':blogComment': outputComment }
  };

  try {
    const res = await docClient.update(params).promise();
    return Util.getSuccessRes(event, res);
  } catch (error) {
    return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
  }
}

export async function deleteComment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.title || !event.queryStringParameters.commentId) {
    return Util.getErrorRes(event, 400, "Missing params: title & commentId");
  }

  const { title, commentId } = event.queryStringParameters;


  // first retrieve the entire article and find the index of the comment...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    }
  }).promise();
  const existingCommentIndex = articleRes.Item.comments.findIndex( ({ id }) => id === commentId );

  if (existingCommentIndex === -1) {
    return Util.getErrorRes(event, 404, "No comment found to delete");
  }

  // ...then using the index to delete that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    },
    ReturnValues: 'NONE',
    UpdateExpression: `REMOVE #comments[${existingCommentIndex}]`,
    ConditionExpression: `#comments[${existingCommentIndex}].id = :commentId`,
    ExpressionAttributeNames: {
      '#comments': 'comments'
    },
    ExpressionAttributeValues: {
      ":commentId": commentId
    }
  }

  try {
    const res = await docClient.update(params).promise();
    return Util.getSuccessRes(event, res);
  } catch (error) {
    return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
  }
}
