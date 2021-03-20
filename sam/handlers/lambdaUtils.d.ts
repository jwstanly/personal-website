import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BlogArticle } from "../../lib/Types";
declare const _default: {
    stripEmails: typeof stripEmails;
    getSuccessRes: typeof getSuccessRes;
    getErrorRes: typeof getErrorRes;
};
export default _default;
declare function stripEmails(article: BlogArticle): void;
declare function getSuccessRes(event: APIGatewayProxyEvent, body: object): APIGatewayProxyResult;
declare function getErrorRes(event: APIGatewayProxyEvent, statusCode: number, message: string): APIGatewayProxyResult;
