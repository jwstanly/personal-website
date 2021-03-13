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
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call getArticle with GET, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters || !event.queryStringParameters.title) {
        return lambdaUtils_1.default.getErrorRes(event, 400, "Missing param: title");
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
        return lambdaUtils_1.default.getErrorRes(event, 404, "No article found");
    }
    console.info(`params: ${JSON.stringify(params)}, articleRes: ${JSON.stringify(articleRes)}`);
    return lambdaUtils_1.default.getSuccessRes(event, articleRes);
};
exports.getArticleByTitle = getArticleByTitle;
const upsertArticle = async (event) => {
    if (event.httpMethod !== 'POST') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
    }
    let articleSubmission;
    try {
        articleSubmission = JSON.parse(event.body);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
    }
    if (!articleSubmission) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No article posted');
    }
    const missingAttributes = [];
    if (!articleSubmission.title)
        missingAttributes.push('title');
    if (!articleSubmission.subheader)
        missingAttributes.push('subheader');
    if (!articleSubmission.tags)
        missingAttributes.push('tags');
    if (!articleSubmission.content)
        missingAttributes.push('content');
    if (missingAttributes.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing attributes: ${missingAttributes.join(', ')}`);
    }
    const article = Object.assign({ id: articleSubmission.id || (String)(Date.now()), createdAt: articleSubmission.createdAt || Date.now(), lastModifiedAt: articleSubmission.lastModifiedAt || Date.now() }, articleSubmission);
    const params = {
        TableName: blogTable,
        Item: Object.assign({ "PartitionKey": `BlogArticle|${article.title.split(' ').join('+')}` }, article)
    };
    const res = await docClient.put(params).promise();
    return lambdaUtils_1.default.getSuccessRes(event, res);
};
exports.upsertArticle = upsertArticle;
const deleteArticle = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters || !event.queryStringParameters.title) {
        return lambdaUtils_1.default.getErrorRes(event, 400, "Missing param: title");
    }
    const { title } = event.queryStringParameters;
    const params = {
        TableName: blogTable,
        Key: {
            "PartitionKey": `BlogArticle|${title.split(' ').join('+')}`,
        },
    };
    const res = await docClient.delete(params).promise();
    return lambdaUtils_1.default.getSuccessRes(event, res);
};
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=blogLambdas.js.map