import { ApiException } from '../../lib/Types';
import getTypeDefinition from './getTypeDefinition';
import isType from './isType';

export default function parseType<T>(json: string, type: string): T {
  let input;
  try {
    input = JSON.parse(json);
  } catch (e) {
    throw {
      res: 'Unable to parse JSON',
      statusCode: 400,
    } as ApiException;
  }
  if (!isType(input, type)) {
    throw {
      statusCode: 400,
      res: {
        message: `Incorrect type. Must match ${type} schema`,
        schema: getTypeDefinition(type),
      },
    } as ApiException;
  }

  return input;
}
