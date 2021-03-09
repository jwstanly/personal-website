"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertArticle = exports.getArticleByTitle = void 0;
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const lambdaUtils_1 = __importDefault(require("./lambdaUtils"));
const blogTable = process.env.BLOG_TABLE;
const docClient = new dynamodb_1.default.DocumentClient();
const getArticleByTitle = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`Must call getArticle with GET, not: ${event.httpMethod}`);
    }
    const { urlEncodedTitle } = event.queryStringParameters;
    if (!urlEncodedTitle) {
        throw new Error(`No urlEncodedTitle included in the query parameters`);
    }
    const params = {
        TableName: blogTable,
        KeyConditionExpression: 'PartitionKey = :hashkey',
        Limit: 1,
        ExpressionAttributeValues: {
            ':hashkey': `BlogArticle|${urlEncodedTitle}`
        }
    };
    const articleRes = await docClient.query(params).promise();
    const response = lambdaUtils_1.default.getHeaders({
        body: JSON.stringify(articleRes)
    });
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
exports.getArticleByTitle = getArticleByTitle;
const upsertArticle = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`Must call upsertArticle with POST, not: ${event.httpMethod}`);
    }
    const articleSubmission = JSON.parse(event.body);
    const errorMessages = [];
    if (!articleSubmission)
        errorMessages.push('No article uploaded');
    if (!articleSubmission.title)
        errorMessages.push('No article title uploaded');
    if (!articleSubmission.urlEncodedTitle)
        errorMessages.push('No article URL encoded title uploaded');
    if (!articleSubmission.subheader)
        errorMessages.push('No article subheader uploaded');
    if (!articleSubmission.tags)
        errorMessages.push('No article tags uploaded');
    if (!articleSubmission.content)
        errorMessages.push('No article content uploaded');
    if (errorMessages.length !== 0) {
        const errorResponse = {
            statusCode: 400,
            body: JSON.stringify({ message: errorMessages.join(' ') })
        };
        console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} body: ${errorResponse.body}`);
        return errorResponse;
    }
    const article = Object.assign({ id: articleSubmission.id || (String)(Date.now()), createdAt: articleSubmission.createdAt || Date.now(), lastModifiedAt: articleSubmission.lastModifiedAt || Date.now() }, articleSubmission);
    const params = {
        TableName: blogTable,
        Item: Object.assign({ PartitionKey: `BlogArticle|${article.urlEncodedTitle}` }, article)
    };
    const res = await docClient.put(params).promise();
    const response = lambdaUtils_1.default.getHeaders({
        body: JSON.stringify(res)
    });
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
exports.upsertArticle = upsertArticle;
//# sourceMappingURL=blogLambdas.js.map