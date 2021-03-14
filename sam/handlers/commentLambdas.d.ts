import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export declare function upsertComment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function deleteComment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
