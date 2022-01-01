import { ValidateFunction } from 'ajv';
import ApiException from './ApiException';
import schema from '../types.schema.json';

export default function validateSchema(
  obj: object,
  type: string,
  validator: ValidateFunction,
) {
  if (!validator(obj)) {
    throw new ApiException({
      res: {
        message: `Incorrect type. Must match ${type} schema`,
        schema: schema.definitions[type],
      },
      statusCode: 400,
    });
  }
}
