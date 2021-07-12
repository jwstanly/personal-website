import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  BlogArticle,
  BlogVote,
  BlogVoteSubmit,
  TitleQueryParam,
} from '../../lib/Types';
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
    bodyParamType: 'BlogVoteSubmit',
    service,
  });
}

export async function service({
  queryParams,
  body: inputVote,
}: ServiceParams<TitleQueryParam, BlogVoteSubmit>) {
  // first retrieve the entire article and find the index of the vote...
  const articleRes = await docClient
    .get({
      TableName: BLOG_TABLE,
      Key: {
        PartitionKey: getKeyByArticleTitle(queryParams.title),
      },
    })
    .promise();

  const existingVote = articleRes.Item.votes
    ? articleRes.Item.votes.find(({ userId }) => userId === inputVote.userId)
    : undefined;
  const existingVoteIndex = articleRes.Item.votes
    ? articleRes.Item.votes.findIndex(
        ({ userId }) => userId === inputVote.userId,
      )
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
    TableName: BLOG_TABLE,
    Key: {
      PartitionKey: getKeyByArticleTitle(queryParams.title),
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression:
      existingVoteIndex === -1
        ? 'SET #votes = list_append(if_not_exists(#votes, :newList), :blogVote)'
        : `SET #votes[${existingVoteIndex}] = :blogVote`,
    ExpressionAttributeNames: {
      '#votes': 'votes',
    },
    ExpressionAttributeValues:
      existingVoteIndex === -1
        ? { ':blogVote': [outputVote], ':newList': [] }
        : { ':blogVote': outputVote },
  };

  const res = await docClient.update(params).promise();

  // strip emails from response so they can't be snooped client-side
  stripEmails(res.Attributes as BlogArticle);

  return res;
}
