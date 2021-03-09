import { APIGatewayProxyResult } from "aws-lambda";

export default {
  getSuccessRes: getSuccessRes,
  getErrorRes: getErrorRes,
}

function getSuccessRes(body: object | string): APIGatewayProxyResult {
  return {
    ...getCommonHeaders(),
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

function getErrorRes(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    ...getCommonHeaders(),
    statusCode: statusCode,
    body: JSON.stringify({ 
      message: message 
    })
  }
}

function getCommonHeaders() {
  return {
    headers: {
      'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
      'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
      'Access-Control-Allow-Origin': '*'
    }
  }
}

export interface BlogArticle {
  id?: string;
  title: string;
  subheader: string;
  image?: string;
  tags: string[];
  createdAt?: number;
  lastModifiedAt?: number;
  content: string;
}