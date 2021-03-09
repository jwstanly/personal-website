"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getSuccessRes: getSuccessRes,
    getErrorRes: getErrorRes,
};
function getSuccessRes(body) {
    return Object.assign(Object.assign({}, getCommonHeaders()), { statusCode: 200, body: JSON.stringify(body) });
}
function getErrorRes(statusCode, message) {
    return Object.assign(Object.assign({}, getCommonHeaders()), { statusCode: statusCode, body: JSON.stringify({
            message: message
        }) });
}
function getCommonHeaders() {
    return {
        headers: {
            'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
            'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
            'Access-Control-Allow-Origin': '*'
        }
    };
}
//# sourceMappingURL=lambdaUtils.js.map