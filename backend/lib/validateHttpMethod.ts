import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { HttpMethod } from '../../lib/enums';
import ApiException from './ApiException';

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
