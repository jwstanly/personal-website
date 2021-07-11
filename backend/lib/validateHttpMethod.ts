import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import ApiException from './ApiException';
import { HttpMethod } from './createHandler';

export default function validateHttpMethod(
  event: APIGatewayProxyEvent,
  requestMethod: HttpMethod,
): void {
  if (event.httpMethod !== requestMethod) {
    throw new ApiException({
      res: `Must invoke with ${requestMethod}, not ${event.httpMethod}`,
      statusCode: 500,
    });
  }
}
