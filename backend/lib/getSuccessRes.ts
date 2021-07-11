import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import getCommonHeaders from './getCommonHeaders';
import logResponse from './logResponse';

export default function getSuccessRes(
  event: APIGatewayProxyEvent,
  res: object | string,
): APIGatewayProxyResult {
  const body = typeof res === 'string' ? { message: res } : res;

  const response = {
    ...getCommonHeaders(),
    statusCode: 200,
    body: JSON.stringify(body),
  };
  logResponse(event, response);
  return response;
}
