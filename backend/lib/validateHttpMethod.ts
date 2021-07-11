import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import ApiException from './ApiException';

export default function validateHttpMethod(
  event: APIGatewayProxyEvent,
  requestMethod:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH',
): void {
  if (event.httpMethod !== requestMethod) {
    throw new ApiException({
      res: `Must invoke with ${requestMethod}, not ${event.httpMethod}`,
      statusCode: 500,
    });
  }
}
