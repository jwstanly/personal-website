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
    replies: existingComment
      ? existingComment.replies
      : inputComment.replies || [],
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

    // strip emails from response so they can't be snooped client-side
    Util.stripEmails(res.Attributes as BlogArticle);

    return Util.getSuccessRes(event, res);
  } catch (error) {
    return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
  }
}

export async function upsertCommentReply(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'POST') {
    return Util.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters) {
    return Util.getErrorRes(event, 400, "No params included");
  }

  const missingParams: string[] = [];
  if(!event.queryStringParameters.title) missingParams.push('article title');
  if(!event.queryStringParameters.rootCommentId) missingParams.push('root comment ID');
  
  if (missingParams.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
  }

  let inputCommentReply: BlogCommentReply;

  try {
    inputCommentReply = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
  }

  if (!inputCommentReply) {
    return Util.getErrorRes(event, 400, 'No comment reply posted');
  }

  const missingAttributes: string[] = [];
  if(!inputCommentReply.user || typeof inputCommentReply.user !== "object") missingAttributes.push('user object');
  if(inputCommentReply.user && !inputCommentReply.user.id) missingAttributes.push('user.id');
  if(!inputCommentReply.replyToId) missingAttributes.push('reply to ID');
  if(!inputCommentReply.rootCommentId) missingAttributes.push('root comment ID');
  if(!inputCommentReply.comment) missingAttributes.push('comment');
  
  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
  }

  if (inputCommentReply.comment.length > 2000) {
    return Util.getErrorRes(event, 400, `Comment replies must be under 2000 characters. Comment reply length submitted: ${inputCommentReply.comment.length}`);
  }

  // first retrieve the entire article and find the index of the comment...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    }
  }).promise();

  const rootComment = articleRes.Item.comments
    ? articleRes.Item.comments.find( ({ id }) => id === event.queryStringParameters.rootCommentId )
    : undefined;
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex( ({ id }) => id === event.queryStringParameters.rootCommentId )
    : -1;

  if(rootCommentIndex === -1) {
    return Util.getErrorRes(event, 404, 'No root comment found');
  }

  // TODO: search `rootComment` for replyToId and send the user an email that someone replied to their comment 

  const existingCommentReply = rootComment.replies && inputCommentReply.id
    ? rootComment.replies.find( ({ id }) => id === inputCommentReply.id )
    : undefined;
  const existingCommentReplyIndex = rootComment.replies && inputCommentReply.id
    ? rootComment.replies.findIndex( ({ id }) => id === inputCommentReply.id )
    : -1;


  const outputCommentReply: BlogCommentReply = {
    ...inputCommentReply,
    id: inputCommentReply.id || String(Date.now()),
    createdAt: existingCommentReply 
      ? existingCommentReply.createdAt
      : inputCommentReply.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
  };

  // ...then using the index to upsert that element of the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: existingCommentReplyIndex === -1 
      ? `SET #comments[${rootCommentIndex}].replies = list_append(if_not_exists(#comments[${rootCommentIndex}].replies, :newList), :blogCommentReply)`
      : `SET #comments[${rootCommentIndex}].replies[${existingCommentReplyIndex}] = :blogCommentReply`,
    ExpressionAttributeNames: {
      '#comments': 'comments'
    },
    ExpressionAttributeValues: existingCommentReplyIndex === -1 
      ? { ':blogCommentReply': [outputCommentReply], ':newList': [] }
      : { ':blogCommentReply': outputCommentReply }
  };

  try {
    const res = await docClient.update(params).promise();

    // strip emails from response so they can't be snooped client-side
    Util.stripEmails(res.Attributes as BlogArticle);

    return Util.getSuccessRes(event, res);
  } catch (error) {
    return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
  }
}

export async function deleteComment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters) {
    return Util.getErrorRes(event, 400, "No params included");
  }

  const missingParams: string[] = [];
  if(!event.queryStringParameters.title) missingParams.push('article title');
  if(!event.queryStringParameters.commentId) missingParams.push('comment ID');
  
  if (missingParams.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
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

export async function deleteCommentReply(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'DELETE') {
    return Util.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters) {
    return Util.getErrorRes(event, 400, "No params included");
  }

  const missingParams: string[] = [];
  if(!event.queryStringParameters.title) missingParams.push('article title');
  if(!event.queryStringParameters.rootCommentId) missingParams.push('root comment ID');
  if(!event.queryStringParameters.replyCommentId) missingParams.push('reply comment ID');
  
  if (missingParams.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
  }

  const { title, rootCommentId, replyCommentId } = event.queryStringParameters;


  // first retrieve the entire article and find the index of the root comment and reply...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    }
  }).promise();
  const rootComment = articleRes.Item.comments
    ? articleRes.Item.comments.find( ({ id }) => id === rootCommentId )
    : undefined;
  const rootCommentIndex = articleRes.Item.comments
    ? articleRes.Item.comments.findIndex( ({ id }) => id === rootCommentId )
    : -1;

  if (rootCommentIndex === -1) {
    return Util.getErrorRes(event, 404, "No root comment found to delete reply from");
  }

  const replyCommentIndex = rootComment.replies.findIndex( ({ id }) => id === replyCommentId );

  if (replyCommentIndex === -1) {
    return Util.getErrorRes(event, 404, "No reply comment found to delete from root comment");
  }

  // ...then using the index to delete that element from the comment list
  const params: DocumentClient.UpdateItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
    },
    ReturnValues: 'NONE',
    UpdateExpression: `REMOVE #comments[${rootCommentIndex}].replies[${replyCommentIndex}]`,
    ConditionExpression: `#comments[${rootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId`,
    ExpressionAttributeNames: {
      '#comments': 'comments'
    },
    ExpressionAttributeValues: {
      ":replyCommentId": replyCommentId
    }
  }

  try {
    const res = await docClient.update(params).promise();
    return Util.getSuccessRes(event, res);
  } catch (error) {
    return Util.getErrorRes(event, 500, `A database error occured. ${error}`);
  }
}
