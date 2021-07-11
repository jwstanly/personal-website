"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = exports.unsubscribeEmail = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const ses_1 = __importDefault(require("aws-sdk/clients/ses"));
const lambdaUtils_1 = __importDefault(require("./lambdaUtils"));
const getEmailHtml_1 = __importStar(require("../../lib/getEmailHtml"));
const blogTable = process.env.BLOG_TABLE;
const awsRegion = process.env.AWS_REGION;
const domainName = process.env.DOMAIN_NAME;
const myEmailAddress = process.env.EMAIL_ADDRESS;
const docClient = new dynamodb_1.DocumentClient();
const sesClient = new ses_1.default({ region: awsRegion });
async function unsubscribeEmail(event) {
    if (event.httpMethod !== 'DELETE') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call unsubscribeEmail with DELETE, not: ${event.httpMethod}`);
    }
    const missingParams = [];
    if (!event.queryStringParameters.title)
        missingParams.push('article title');
    if (!event.queryStringParameters.commentId)
        missingParams.push('comment ID');
    if (!event.queryStringParameters.email)
        missingParams.push('email');
    if (missingParams.length) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
    }
    // retrieve the entire article and find the index of the comment...
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
    // find root comment to delete email from
    const rootCommentIndex = articleRes.Item.comments
        ? articleRes.Item.comments.findIndex(({ id }) => id === event.queryStringParameters.commentId)
        : undefined;
    // user was the root comment; delete email from root comment
    if (rootCommentIndex >= 0) {
        const params = {
            TableName: blogTable,
            Key: {
                PartitionKey: `BlogArticle|${event.queryStringParameters.title
                    .split(' ')
                    .join('+')}`,
            },
            ReturnValues: 'NONE',
            UpdateExpression: `REMOVE #comments[${rootCommentIndex}].#user.email`,
            ConditionExpression: `#comments[${rootCommentIndex}].id = :commentId AND #comments[${rootCommentIndex}].#user.email = :email`,
            ExpressionAttributeNames: {
                '#comments': 'comments',
                '#user': 'user',
            },
            ExpressionAttributeValues: {
                ':commentId': event.queryStringParameters.commentId,
                ':email': event.queryStringParameters.email,
            },
        };
        try {
            const res = await docClient.update(params).promise();
            return lambdaUtils_1.default.getSuccessRes(event, res);
        }
        catch (error) {
            return lambdaUtils_1.default.getErrorRes(event, 500, `A database error occurred. ${error}`);
        }
    }
    else {
        // user was from a reply comment; delete email from reply comment in root comment
        let replyRootCommentIndex = -2;
        let replyCommentIndex;
        for (let i = 0; i < articleRes.Item.comments.length; i++) {
            if (articleRes.Item.comments[i].replies) {
                replyCommentIndex = articleRes.Item.comments[i].replies.findIndex(({ id }) => id === event.queryStringParameters.commentId);
                if (replyCommentIndex >= 0) {
                    replyRootCommentIndex = i;
                    break;
                }
            }
        }
        const params = {
            TableName: blogTable,
            Key: {
                PartitionKey: `BlogArticle|${event.queryStringParameters.title
                    .split(' ')
                    .join('+')}`,
            },
            ReturnValues: 'NONE',
            UpdateExpression: `REMOVE #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email`,
            ConditionExpression: `#comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId AND #comments[${replyRootCommentIndex}].replies[${replyCommentIndex}].#user.email = :email`,
            ExpressionAttributeNames: {
                '#comments': 'comments',
                '#user': 'user',
            },
            ExpressionAttributeValues: {
                ':replyCommentId': event.queryStringParameters.commentId,
                ':email': event.queryStringParameters.email,
            },
        };
        try {
            const res = await docClient.update(params).promise();
            return lambdaUtils_1.default.getSuccessRes(event, res);
        }
        catch (error) {
            return lambdaUtils_1.default.getErrorRes(event, 500, `A database error occurred. ${error}`);
        }
    }
}
exports.unsubscribeEmail = unsubscribeEmail;
async function contact(event) {
    var _a, _b, _c;
    if (event.httpMethod !== 'POST') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call unsubscribeEmail with POST, not: ${event.httpMethod}`);
    }
    let inputMessage;
    try {
        inputMessage = JSON.parse(event.body);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
    }
    if (!inputMessage) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No message posted');
    }
    const missingAttributes = [];
    if (!inputMessage.user || typeof inputMessage.user !== 'object')
        missingAttributes.push('user object');
    if (!((_a = inputMessage.user) === null || _a === void 0 ? void 0 : _a.id))
        missingAttributes.push('user.id');
    if (!((_b = inputMessage.user) === null || _b === void 0 ? void 0 : _b.name))
        missingAttributes.push('user.name');
    if (!((_c = inputMessage.user) === null || _c === void 0 ? void 0 : _c.email))
        missingAttributes.push('user.email');
    if (!inputMessage.message || typeof inputMessage.message !== 'string')
        missingAttributes.push('message');
    if (missingAttributes.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
    }
    console.log('received:', inputMessage);
    const emailParams = {
        Destination: {
            ToAddresses: [myEmailAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: getEmailHtml_1.default({
                        domainName: domainName,
                        type: getEmailHtml_1.EmailType.Contact,
                        contactInfo: {
                            inputMessage: inputMessage,
                        },
                    }),
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: inputMessage.subject ||
                    `${inputMessage.user.name} has contacted you from ${domainName}`,
            },
        },
        Source: `contact@${domainName}`,
    };
    try {
        const res = await sesClient.sendEmail(emailParams).promise();
        return lambdaUtils_1.default.getSuccessRes(event, res);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 500, `An email error occurred. ${error}`);
    }
}
exports.contact = contact;
//# sourceMappingURL=emailLambdas.js.map