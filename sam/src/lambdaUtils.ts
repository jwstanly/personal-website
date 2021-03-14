import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export default {
  getSuccessRes: getSuccessRes,
  getErrorRes: getErrorRes,
}

function getSuccessRes(event: APIGatewayProxyEvent, body: object): APIGatewayProxyResult {
  const response = {
    ...getCommonHeaders(),
    statusCode: 200,
    body: JSON.stringify(body)
  }
  // Prints in CloudWatch
  console.info(`SUCCESS: response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
  return response;
}

function getErrorRes(event: APIGatewayProxyEvent, statusCode: number, message: string): APIGatewayProxyResult {
  const response = {
    ...getCommonHeaders(),
    statusCode: statusCode,
    body: JSON.stringify({ 
      error: message 
    })
  }
  // Prints in CloudWatch
  console.info(`ERROR: response from: ${event.path} statusCode: ${statusCode} response: ${JSON.stringify(response)}`);
  return response;
}

function getCommonHeaders() {
  return {
    headers: {
      'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
      'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
      'Access-Control-Allow-Origin': '*' //'https://www.jwstanly.com'
    }
  }
}
