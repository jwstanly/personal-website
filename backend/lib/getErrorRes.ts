import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import ApiException from './ApiException';
import getCommonHeaders from './getCommonHeaders';
import logResponse from './logResponse';

export default function getErrorRes(
  event: APIGatewayProxyEvent,
  error: ApiException,
): APIGatewayProxyResult {
  const response = {
    ...getCommonHeaders(),
    statusCode: error.statusCode,
    body: JSON.stringify(error.res),
  };
  logResponse(event, response);
  return response;
}
