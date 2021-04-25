import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Util from './lambdaUtils';
import { BlogArticle, BlogVote } from '../../lib/Types';

const blogTable = process.env.BLOG_TABLE;
const docClient = new DocumentClient();

export async function upsertVote(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod !== 'GET') {
    return Util.getErrorRes(event, 405, `Must call getAllArticles with GET, not: ${event.httpMethod}`);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.title) {
    return Util.getErrorRes(event, 400, "Missing param: title");
  }

  let inputVote: BlogVote;

  try {
    inputVote = JSON.parse(event.body);
  } catch (error) {
    return Util.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
  }

  if (!inputVote) {
    return Util.getErrorRes(event, 400, 'No vote posted');
  }

  const missingAttributes: string[] = [];
  if(!inputVote.userId) missingAttributes.push('userID');
  if(inputVote.vote) missingAttributes.push('vote');

  if (missingAttributes.length !== 0) {
    return Util.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
  }

  // first retrieve the entire article and find the index of the vote...
  const articleRes = await docClient.get({
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    }
  }).promise();


  const existingVote = articleRes.Item.votes
    ? articleRes.Item.votes.find( ({ userId }) => userId === inputVote.userId )
    : undefined;
  const existingVoteIndex = articleRes.Item.votes
    ? articleRes.Item.votes.findIndex( ({ userId }) => userId === inputVote.userId )
    : -1;

  const outputVote: BlogVote = {
    userId: inputVote.userId,
    createdAt: existingVote 
      ? existingVote.createdAt
      : inputVote.createdAt || Date.now(),
    lastModifiedAt: Date.now(),
    vote: inputVote.vote,
  };

  // ...then using the index to upsert that element of the vote list
  const params: DocumentClient.UpdateItemInput = {
    TableName: blogTable,
    Key: {
      "PartitionKey": `BlogArticle|${event.queryStringParameters.title.split(' ').join('+')}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: existingVoteIndex === -1 
      ? 'SET #votes = list_append(if_not_exists(#votes, :newList), :blogVote)'
      : `SET #votes[${existingVoteIndex}] = :blogVote`,
    ExpressionAttributeNames: {
      '#votes': 'votes'
    },
    ExpressionAttributeValues: existingVoteIndex === -1 
      ? { ':blogVote': [outputVote], ':newList': [] }
      : { ':blogVote': outputVote }
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