import { ApiError } from '../../lib/Types';
import isType from './isType';

export default function parseType<T>(json: string, type: string): T {
  let input;
  try {
    input = JSON.parse(json);
  } catch (e) {
    throw {
      message: 'Unable to parse JSON',
      statusCode: 400,
    } as ApiError;
  }
  if (!isType(input, type)) {
    throw {
      message: 'Incorrect type',
      statusCode: 400,
    } as ApiError;
  }

  return input;
}
