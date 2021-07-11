import ApiException from './ApiException';
import getTypeDefinition from './getTypeDefinition';
import isType from './isType';

export default function parseType<T>(json: string, type: string): T {
  let input;
  try {
    input = JSON.parse(json);
  } catch (e) {
    throw new ApiException({
      res: 'Unable to parse JSON',
      statusCode: 400,
    });
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
