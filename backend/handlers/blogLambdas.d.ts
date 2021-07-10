import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export declare function getAllArticles(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult>;
export declare function getArticleByTitle(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult>;
export declare function upsertArticle(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult>;
export declare function deleteArticle(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult>;
