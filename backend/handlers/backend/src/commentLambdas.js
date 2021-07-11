"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentReply = exports.deleteComment = exports.upsertCommentReply = exports.upsertComment = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const ses_1 = __importDefault(require("aws-sdk/clients/ses"));
const lambdaUtils_1 = __importDefault(require("./lambdaUtils"));
const blogTable = process.env.BLOG_TABLE;
const awsRegion = process.env.AWS_REGION;
const domainName = process.env.DOMAIN_NAME;
const docClient = new dynamodb_1.DocumentClient();
const ses = new ses_1.default({ region: awsRegion });
async function upsertComment(event) {
    if (event.httpMethod !== 'POST') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters || !event.queryStringParameters.title) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'Missing param: title');
    }
    let inputComment;
    try {
        inputComment = JSON.parse(event.body);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
    }
    if (!inputComment) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No comment posted');
    }
    const missingAttributes = [];
    if (!inputComment.user || typeof inputComment.user !== 'object')
        missingAttributes.push('user object');
    if (inputComment.user && !inputComment.user.id)
        missingAttributes.push('user.id');
    if (!inputComment.comment)
        missingAttributes.push('comment');
    if (missingAttributes.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
    }
    if (inputComment.comment.length > 2000) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Comments must be under 2000 characters. Comment length submitted: ${inputComment.comment.length}`);
    }
    // first retrieve the entire article and find the index of the comment...
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
    const existingComment = articleRes.Item.comments
        ? articleRes.Item.comments.find(({ id }) => id === inputComment.id)
        : undefined;
    const existingCommentIndex = articleRes.Item.comments
        ? articleRes.Item.comments.findIndex(({ id }) => id === inputComment.id)
        : -1;
    // preserve email accross edits (client-side never gets email back to edit)
    const outputUser = inputComment.user;
    if (!inputComment.user.email &&
        existingComment &&
        existingComment.user &&
        existingComment.user.email) {
        outputUser.email = existingComment.user.email;
    }
    const outputComment = Object.assign(Object.assign({}, inputComment), { user: outputUser, id: inputComment.id || String(Date.now()), createdAt: existingComment
            ? existingComment.createdAt
            : inputComment.createdAt || Date.now(), lastModifiedAt: Date.now(), replies: existingComment
            ? existingComment.replies
            : inputComment.replies || [] });
    // ...then using the index to upsert that element of the comment list
    const params = {
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${event.queryStringParameters.title
                .split(' ')
                .join('+')}`,
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: existingCommentIndex === -1
            ? 'SET #comments = list_append(if_not_exists(#comments, :newList), :blogComment)'
            : `SET #comments[${existingCommentIndex}] = :blogComment`,
        ExpressionAttributeNames: {
            '#comments': 'comments',
        },
        ExpressionAttributeValues: existingCommentIndex === -1
            ? { ':blogComment': [outputComment], ':newList': [] }
            : { ':blogComment': outputComment },
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
exports.upsertComment = upsertComment;
async function upsertCommentReply(event) {
    if (event.httpMethod !== 'POST') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call upsertArticle with POST, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No params included');
    }
    const missingParams = [];
    if (!event.queryStringParameters.title)
        missingParams.push('article title');
    if (!event.queryStringParameters.rootCommentId)
        missingParams.push('root comment ID');
    if (missingParams.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
    }
    let inputCommentReply;
    try {
        inputCommentReply = JSON.parse(event.body);
    }
    catch (error) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Failed to parse JSON. Error info: ${error}`);
    }
    if (!inputCommentReply) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No comment reply posted');
    }
    const missingAttributes = [];
    if (!inputCommentReply.user || typeof inputCommentReply.user !== 'object')
        missingAttributes.push('user object');
    if (inputCommentReply.user && !inputCommentReply.user.id)
        missingAttributes.push('user.id');
    if (!inputCommentReply.replyToId)
        missingAttributes.push('reply to ID');
    if (!inputCommentReply.rootCommentId)
        missingAttributes.push('root comment ID');
    if (!inputCommentReply.comment)
        missingAttributes.push('comment');
    if (missingAttributes.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing body attributes: ${missingAttributes.join(', ')}`);
    }
    if (inputCommentReply.comment.length > 2000) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Comment replies must be under 2000 characters. Comment reply length submitted: ${inputCommentReply.comment.length}`);
    }
    // first retrieve the entire article and find the index of the comment...
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
    const rootComment = articleRes.Item.comments
        ? articleRes.Item.comments.find(({ id }) => id === event.queryStringParameters.rootCommentId)
        : undefined;
    const rootCommentIndex = articleRes.Item.comments
        ? articleRes.Item.comments.findIndex(({ id }) => id === event.queryStringParameters.rootCommentId)
        : -1;
    if (rootCommentIndex === -1) {
        return lambdaUtils_1.default.getErrorRes(event, 404, 'No root comment found');
    }
    const repliedToComment = rootComment.id === inputCommentReply.replyToId
        ? rootComment
        : rootComment.replies.find(({ id }) => id === inputCommentReply.replyToId);
    if (!repliedToComment) {
        return lambdaUtils_1.default.getErrorRes(event, 404, 'No reply comment found');
    }
    if (repliedToComment.user.email) {
        console.log('Emailing', repliedToComment.user.email);
        const emailParams = {
            Destination: {
                ToAddresses: [repliedToComment.user.email],
                BccAddresses: ['jwstanly@yahoo.com'],
            },
            Message: {
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Your blog comment has a response!',
                },
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: lambdaUtils_1.default.getEmailHTML(domainName, articleRes.Item, repliedToComment, inputCommentReply),
                    },
                },
            },
            Source: `donotreply@${domainName}`,
        };
        // Instead of throwing 500s, report errors to CloudWatch
        // Clients shouldn't experience a total failure just because the email failed
        try {
            const res = await ses.sendEmail(emailParams).promise();
            console.log('SES SUCCESS', res);
        }
        catch (error) {
            console.log('SES ERROR:', error);
        }
    }
    const existingCommentReply = rootComment.replies && inputCommentReply.id
        ? rootComment.replies.find(({ id }) => id === inputCommentReply.id)
        : undefined;
    const existingCommentReplyIndex = rootComment.replies && inputCommentReply.id
        ? rootComment.replies.findIndex(({ id }) => id === inputCommentReply.id)
        : -1;
    // preserve email accross edits (client-side never gets email back to edit)
    const outputUser = inputCommentReply.user;
    if (!inputCommentReply.user.email &&
        existingCommentReply &&
        existingCommentReply.user &&
        existingCommentReply.user.email) {
        outputUser.email = existingCommentReply.user.email;
    }
    const outputCommentReply = Object.assign(Object.assign({}, inputCommentReply), { user: outputUser, id: inputCommentReply.id || String(Date.now()), createdAt: existingCommentReply
            ? existingCommentReply.createdAt
            : inputCommentReply.createdAt || Date.now(), lastModifiedAt: Date.now() });
    // ...then using the index to upsert that element of the comment list
    const params = {
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${event.queryStringParameters.title
                .split(' ')
                .join('+')}`,
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: existingCommentReplyIndex === -1
            ? `SET #comments[${rootCommentIndex}].replies = list_append(if_not_exists(#comments[${rootCommentIndex}].replies, :newList), :blogCommentReply)`
            : `SET #comments[${rootCommentIndex}].replies[${existingCommentReplyIndex}] = :blogCommentReply`,
        ExpressionAttributeNames: {
            '#comments': 'comments',
        },
        ExpressionAttributeValues: existingCommentReplyIndex === -1
            ? { ':blogCommentReply': [outputCommentReply], ':newList': [] }
            : { ':blogCommentReply': outputCommentReply },
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
exports.upsertCommentReply = upsertCommentReply;
async function deleteComment(event) {
    if (event.httpMethod !== 'DELETE') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No params included');
    }
    const missingParams = [];
    if (!event.queryStringParameters.title)
        missingParams.push('article title');
    if (!event.queryStringParameters.commentId)
        missingParams.push('comment ID');
    if (missingParams.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
    }
    const { title, commentId } = event.queryStringParameters;
    // first retrieve the entire article and find the index of the comment...
    const articleRes = await docClient
        .get({
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
        },
    })
        .promise();
    const existingCommentIndex = articleRes.Item.comments.findIndex(({ id }) => id === commentId);
    if (existingCommentIndex === -1) {
        return lambdaUtils_1.default.getErrorRes(event, 404, 'No comment found to delete');
    }
    // ...then using the index to delete that element of the comment list
    const params = {
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
        },
        ReturnValues: 'NONE',
        UpdateExpression: `REMOVE #comments[${existingCommentIndex}]`,
        ConditionExpression: `#comments[${existingCommentIndex}].id = :commentId`,
        ExpressionAttributeNames: {
            '#comments': 'comments',
        },
        ExpressionAttributeValues: {
            ':commentId': commentId,
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
exports.deleteComment = deleteComment;
async function deleteCommentReply(event) {
    if (event.httpMethod !== 'DELETE') {
        return lambdaUtils_1.default.getErrorRes(event, 405, `Must call deleteArticle with DELETE, not: ${event.httpMethod}`);
    }
    if (!event.queryStringParameters) {
        return lambdaUtils_1.default.getErrorRes(event, 400, 'No params included');
    }
    const missingParams = [];
    if (!event.queryStringParameters.title)
        missingParams.push('article title');
    if (!event.queryStringParameters.rootCommentId)
        missingParams.push('root comment ID');
    if (!event.queryStringParameters.replyCommentId)
        missingParams.push('reply comment ID');
    if (missingParams.length !== 0) {
        return lambdaUtils_1.default.getErrorRes(event, 400, `Missing params: ${missingParams.join(', ')}`);
    }
    const { title, rootCommentId, replyCommentId } = event.queryStringParameters;
    // first retrieve the entire article and find the index of the root comment and reply...
    const articleRes = await docClient
        .get({
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
        },
    })
        .promise();
    const rootComment = articleRes.Item.comments
        ? articleRes.Item.comments.find(({ id }) => id === rootCommentId)
        : undefined;
    const rootCommentIndex = articleRes.Item.comments
        ? articleRes.Item.comments.findIndex(({ id }) => id === rootCommentId)
        : -1;
    if (rootCommentIndex === -1) {
        return lambdaUtils_1.default.getErrorRes(event, 404, 'No root comment found to delete reply from');
    }
    const replyCommentIndex = rootComment.replies.findIndex(({ id }) => id === replyCommentId);
    if (replyCommentIndex === -1) {
        return lambdaUtils_1.default.getErrorRes(event, 404, 'No reply comment found to delete from root comment');
    }
    // ...then using the index to delete that element from the comment list
    const params = {
        TableName: blogTable,
        Key: {
            PartitionKey: `BlogArticle|${title.split(' ').join('+')}`,
        },
        ReturnValues: 'NONE',
        UpdateExpression: `REMOVE #comments[${rootCommentIndex}].replies[${replyCommentIndex}]`,
        ConditionExpression: `#comments[${rootCommentIndex}].replies[${replyCommentIndex}].id = :replyCommentId`,
        ExpressionAttributeNames: {
            '#comments': 'comments',
        },
        ExpressionAttributeValues: {
            ':replyCommentId': replyCommentId,
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
exports.deleteCommentReply = deleteCommentReply;
//# sourceMappingURL=commentLambdas.js.map