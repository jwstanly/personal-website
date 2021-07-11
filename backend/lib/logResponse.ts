import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import shouldLog from './shouldLog';

export default function logResponse(
  event: APIGatewayProxyEvent,
  response: APIGatewayProxyResult,
): void {
  if (shouldLog()) {
    console.log(
      `${response.statusCode === 200 ? 'SUCCESS' : 'ERROR'}: response from ${
        event.path
      } statusCode: ${response.statusCode} response: ${JSON.stringify(
        response,
      )}`,
    );
  }
}
