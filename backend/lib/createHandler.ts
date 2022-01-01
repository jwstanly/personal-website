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
import validateHttpMethod from './validateHttpMethod';
import schema from '../types.schema.json';
import Ajv from 'ajv';
import validateSchema from './validateSchema';

interface HandlerOptions {
  queryParamType?: string;
  bodyParamType?: string;
  httpMethod: HttpMethod;
  service: (arg: ServiceParams<any, any>) => Promise<any> | any;
}

const ajv = new Ajv();

export function createHandle({
  queryParamType,
  bodyParamType,
  httpMethod,
  service,
}: HandlerOptions): (
  event: APIGatewayProxyEvent,
) => Promise<APIGatewayProxyResult> {
  const queryParamsValidator = ajv.compile(
    schema.definitions[queryParamType] || {},
  );
  const bodyParamsValidator = ajv.compile(
    schema.definitions[bodyParamType] || {},
  );

  return async event => {
    try {
      logEvent(event);

      validateHttpMethod(event, httpMethod);

      const serviceParams: ServiceParams<any, any> = {};

      if (queryParamType) {
        const params = event.queryStringParameters;
        validateSchema(params, queryParamType, queryParamsValidator);
        serviceParams.queryParams = params;
      }

      if (bodyParamType) {
        const params = JSON.parse(event.body);
        validateSchema(params, bodyParamType, bodyParamsValidator);
        serviceParams.queryParams = params;
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
  };
}
