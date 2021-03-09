"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getHeaders: getHeaders
};
function getHeaders(res) {
    return Object.assign({ statusCode: 200, headers: {
            'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
            'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
            'Access-Control-Allow-Origin': '*'
        } }, res);
}
//# sourceMappingURL=lambdaUtils.js.map