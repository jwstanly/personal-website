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

  let submission: BlogComment;

  try {
    submission = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
  }

  if (!submission.blogComment) {
    return Util.getErrorRes(event, 400, 'No comment posted');
  }

  const missingAttributes: string[] = [];
  if(!submission.title) missingAttributes.push('article title');
  if(!submission.blogComment.user || typeof submission.blogComment.user !== "object") missingAttributes.push('user object');
  if(submission.blogComment.user && !submission.blogComment.user.id) missingAttributes.push('user.id');
  if(!submission.blogComment.comment) missingAttributes.push('comment');
  
  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
  }

  if (submission.blogComment.comment.length > 2000) {
    return Util.getErrorRes(event, 400, `Comments must be under 2000 characters. Comment length submitted: ${submission.blogComment.comment.length}`);
  }

  // first retrieve the entire article and find the index of the comment...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${submission.title.split(' ').join('+')}`,
    }
  }).promise();

  const existingComment = articleRes.Item.comments
    ? articleRes.Item.comments.find( ({ id }) => id === submission.blogComment.id )
    : undefined;
  const existingCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex( ({ id }) => id === submission.blogComment.id )
    : -1;

  const comment: BlogComment = {
    ...submission.blogComment,
    id: submission.blogComment.id || String(Date.now()),
    createdAt: existingComment 
      ? existingComment.createdAt
      : submission.blogComment.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
  };

  // ...then using the index to upsert that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${submission.title.split(' ').join('+')}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: existingCommentIndex === -1 
      ? 'SET #comments = list_append(if_not_exists(#comments, :newList), :blogComment)'
      : `SET #comments[${existingCommentIndex}] = :blogComment`,
    ExpressionAttributeNames: {
      '#comments': 'comments'
    },
    ExpressionAttributeValues: existingCommentIndex === -1 
      ? { ':blogComment': [comment], ':newList': [] }
      : { ':blogComment': comment }
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