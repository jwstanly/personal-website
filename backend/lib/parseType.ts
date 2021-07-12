import ApiException from './ApiException';
import getTypeDefinition from './getTypeDefinition';
import isType from './isType';

export default function parseType<T extends object>(
  json: string | object,
  type: string | object,
): T {
  let input;
  if (typeof json === 'string') {
    try {
      input = JSON.parse(json);
    } catch (e) {
      throw new ApiException({
        res: 'Unable to parse JSON',
        statusCode: 400,
      });
    }
  } else {
    input = json;
  }

  if (!isType(input, type)) {
    throw new ApiException({
      res: {
        message: `Incorrect type. Must match ${type} schema`,
        schema: getTypeDefinition(type),
      },
      statusCode: 400,
    });
  }

  return input;
}
