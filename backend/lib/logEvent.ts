import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import shouldLog from './shouldLog';

export default function logEvent(event: APIGatewayProxyEvent): void {
  if (shouldLog()) {
    console.log('Event:', event);
  }
}
