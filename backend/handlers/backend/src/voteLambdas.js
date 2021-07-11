"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertVote = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const lambdaUtils_1 = __importDefault(require("./lambdaUtils"));
const blogTable = process.env.BLOG_TABLE;
const docClient = new dynamodb_1.DocumentClient();
async function upsertVote(event) {
    if (event.httpMethod !== 'POST') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call upsertVote with POST, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters || !event.queryStringParameters.title) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'Missing param: title');
    }
    let inputVote;
    try {
        inputVote = JSON.parse(event.body);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
    }
    if (!inputVote) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No vote posted');
    }
    const missingAttributes = [];
    if (!inputVote.userId)
        missingAttributes.push('userID');
    if (!inputVote.vote)
        missingAttributes.push('vote');
    if (missingAttributes.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
    }
    // first retrieve the entire article and find the index of the vote...
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
    const existingVote = articleRes.Item.votes
        ? articleRes.Item.votes.find(({ userId }) => userId === inputVote.userId)
        : undefined;
    const existingVoteIndex = articleRes.Item.votes
        ? articleRes.Item.votes.findIndex(({ userId }) => userId === inputVote.userId)
        : -1;
    const outputVote = {
        userId: inputVote.userId,
        createdAt: existingVote
            ? existingVote.createdAt
            : inputVote.createdAt || Date.now(),
        lastModifiedAt: Date.now(),
        vote: inputVote.vote,
    };
    // ...then using the index to upsert that element of the vote list
    const params = {
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${event.queryStringParameters.title
                .split(' ')
                .join('+')}`,
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: existingVoteIndex === -1
            ? 'SET #votes = list_append(if_not_exists(#votes, :newList), :blogVote)'
            : `SET #votes[${existingVoteIndex}] = :blogVote`,
        ExpressionAttributeNames: {
            '#votes': 'votes',
        },
        ExpressionAttributeValues: existingVoteIndex === -1
            ? { ':blogVote': [outputVote], ':newList': [] }
            : { ':blogVote': outputVote },
    };
    try {
        const res = await docClient.update(params).promise();
        // strip emails from response so they can't be snooped client-side
        lambdaUtils_1.default.stripEmails(res.Attributes);
        return lambdaUtils_1.default.getSuccessRes(event, res);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 500, `A database error occurred. ${error}`);
    }
}
exports.upsertVote = upsertVote;
//# sourceMappingURL=voteLambdas.js.map