import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

export default function logEvent(event: APIGatewayProxyEvent): void {
  console.log('Event:', event);
}
