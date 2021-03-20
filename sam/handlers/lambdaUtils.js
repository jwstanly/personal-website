"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    stripEmails: stripEmails,
    getSuccessRes: getSuccessRes,
    getErrorRes: getErrorRes,
};
function stripEmails(article) {
    if (article.comments) {
        for (let i = 0; i < article.comments.length; i++) {
            if (article.comments[i].user && article.comments[i].user.email) {
                delete article.comments[i].user.email;
            }
            if (article.comments[i].replies) {
                for (let j = 0; j < article.comments[i].replies.length; j++) {
                    delete article.comments[i].replies[j].user.email;
                }
            }
        }
    }
}
function getSuccessRes(event, body) {
    const response = Object.assign(Object.assign({}, getCommonHeaders()), { statusCode: 200, body: JSON.stringify(body) });
    // Prints in CloudWatch
    console.info(`SUCCESS: response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
    return response;
}
function getErrorRes(event, statusCode, message) {
    const response = Object.assign(Object.assign({}, getCommonHeaders()), { statusCode: statusCode, body: JSON.stringify({
            error: message
        }) });
    // Prints in CloudWatch
    console.info(`ERROR: response from: ${event.path} statusCode: ${statusCode} response: ${JSON.stringify(response)}`);
    return response;
}
function getCommonHeaders() {
    return {
        headers: {
            'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
            'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
            'Access-Control-Allow-Origin': '*' //'https://www.jwstanly.com'
        }
    };
}
//# sourceMappingURL=lambdaUtils.js.map