import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { ApiExceptionRes } from '../../lib/Types';
import getCommonHeaders from './getCommonHeaders';
import logResponse from './logResponse';

export default function getErrorRes(
  event: APIGatewayProxyEvent,
  statusCode: number,
  res: ApiExceptionRes,
): APIGatewayProxyResult {
  const body = {
    error: typeof res === 'string' ? { message: res } : res,
  };

  const response = {
    ...getCommonHeaders(),
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
  logResponse(event, response);
  return response;
}
