import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export declare const getArticleByTitle: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
export declare const upsertArticle: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
export declare const deleteArticle: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
