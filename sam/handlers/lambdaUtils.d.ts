import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
declare const _default: {
    getSuccessRes: typeof getSuccessRes;
    getErrorRes: typeof getErrorRes;
};
export default _default;
declare function getSuccessRes(event: APIGatewayProxyEvent, body: object | string): APIGatewayProxyResult;
declare function getErrorRes(event: APIGatewayProxyEvent, statusCode: number, message: string): APIGatewayProxyResult;
export interface BlogArticle {
    id?: string;
    title: string;
    subheader: string;
    image?: string;
    tags: string[];
    createdAt?: number;
    lastModifiedAt?: number;
    content: string;
}
