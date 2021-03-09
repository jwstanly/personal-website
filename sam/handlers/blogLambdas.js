"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.upsertArticle = exports.getArticleByTitle = void 0;
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const lambdaUtils_1 = __importDefault(require("./lambdaUtils"));
const blogTable = process.env.BLOG_TABLE;
const docClient = new dynamodb_1.default.DocumentClient();
const getArticleByTitle = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`Must call getArticle with GET, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters || !event.queryStringParameters.title) {
        const errorResponse = lambdaUtils_1.default.getErrorRes(400, "Missing param: title");
        console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
        return errorResponse;
    }
    const { title } = event.queryStringParameters;
    const params = {
        TableName: blogTable,
        Key: {
            "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
        }
    };
    const articleRes = await docClient.get(params).promise();
    if (Object.keys(articleRes).length === 0) {
        const errorResponse = lambdaUtils_1.default.getErrorRes(404, "No article found");
        console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
        return errorResponse;
    }
    console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articleRes)}`);
    const response = lambdaUtils_1.default.getSuccessRes(articleRes);
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
    return response;
};
exports.getArticleByTitle = getArticleByTitle;
const upsertArticle = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`Must call upsertArticle with POST, not: ${event.httpMethod}`);
    }
    const articleSubmission = JSON.parse(event.body);
    const missingAttributes = [];
    if (!articleSubmission)
        missingAttributes.push('No article uploaded');
    if (!articleSubmission.title)
        missingAttributes.push('title');
    if (!articleSubmission.subheader)
        missingAttributes.push('subheader');
    if (!articleSubmission.tags)
        missingAttributes.push('tags');
    if (!articleSubmission.content)
        missingAttributes.push('content');
    if (missingAttributes.length !== 0) {
        const errorResponse = lambdaUtils_1.default.getErrorRes(400, `Missing attributes: ${missingAttributes.join(', ')}`);
        console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
        return errorResponse;
    }
    const article = Object.assign({ id: articleSubmission.id || (String)(Date.now()), createdAt: articleSubmission.createdAt || Date.now(), lastModifiedAt: articleSubmission.lastModifiedAt || Date.now() }, articleSubmission);
    const params = {
        TableName: blogTable,
        Item: Object.assign({ "PartitionKey": `BlogArticle|${article.title.split(' ').join('+')}` }, article)
    };
    const res = await docClient.put(params).promise();
    const response = lambdaUtils_1.default.getSuccessRes(res);
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
    return response;
};
exports.upsertArticle = upsertArticle;
const deleteArticle = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`delete only accepts DELETE method, you tried: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters || !event.queryStringParameters.title) {
        const errorResponse = lambdaUtils_1.default.getErrorRes(400, "Missing param: title");
        console.info(`response from: ${event.path} statusCode: ${errorResponse.statusCode} response: ${JSON.stringify(errorResponse)}`);
        return errorResponse;
    }
    const { title } = event.queryStringParameters;
    const params = {
        TableName: blogTable,
        Key: {
            "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
        },
    };
    const res = await docClient.delete(params).promise();
    const response = lambdaUtils_1.default.getSuccessRes(res);
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
    return response;
};
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=blogLambdas.js.map