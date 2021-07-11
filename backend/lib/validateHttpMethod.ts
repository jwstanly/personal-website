import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { ApiError } from '../../lib/Types';

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
    throw {
      message: `Must invoke with ${requestMethod}, not ${event.httpMethod}`,
      statusCode: 500,
    } as ApiError;
  }
}
