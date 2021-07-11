import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';

export default function logResponse(
  event: APIGatewayProxyEvent,
  response: APIGatewayProxyResult,
): void {
  console.info(
    `${response.statusCode === 200 ? 'SUCCESS' : 'ERROR'}: response from ${
      event.path
    } statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`,
  );
}
