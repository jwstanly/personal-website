import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import getCommonHeaders from './getCommonHeaders';
import logResponse from './logResponse';

export default function getErrorRes(
  event: APIGatewayProxyEvent,
  statusCode: number,
  message: string,
): APIGatewayProxyResult {
  const response = {
    ...getCommonHeaders(),
    statusCode: statusCode,
    body: JSON.stringify({
      error: message,
    }),
  };
  logResponse(event, response);
  return response;
}
