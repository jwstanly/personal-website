import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { HttpMethod } from '../../lib/enums';
import { ServiceParams } from '../../lib/Types';
import ApiException from './ApiException';
import getErrorRes from './getErrorRes';
import getSuccessRes from './getSuccessRes';
import logEvent from './logEvent';
import logInput from './logInput';
import parseType from './parseType';
import validateHttpMethod from './validateHttpMethod';

interface HandlerOptions {
  event: APIGatewayProxyEvent;
  httpMethod: HttpMethod;
  queryParamType?: string;
  bodyParamType?: string;
  service: (arg?: ServiceParams<any, any>) => Promise<any> | any;
}

export default async function createHandler({
  event,
  httpMethod,
  queryParamType,
  bodyParamType,
  service,
}: HandlerOptions): Promise<APIGatewayProxyResult> {
  try {
    logEvent(event);

    validateHttpMethod(event, httpMethod);

    const serviceParams: ServiceParams<object, object> = {};

    if (queryParamType) {
      serviceParams.queryParams = parseType(
        event.queryStringParameters,
        queryParamType,
      );
    }

    if (bodyParamType) {
      serviceParams.body = parseType(event.body, bodyParamType);
    }

    logInput(serviceParams);

    const res = await service(serviceParams);

    return getSuccessRes(event, res);
  } catch (error) {
    if (error instanceof ApiException) {
      return getErrorRes(event, error);
    } else {
      return getErrorRes(
        event,
        new ApiException({
          statusCode: 500,
          res: `An unknown error occurred. Error: ${error}`,
        }),
      );
    }
  }
}
