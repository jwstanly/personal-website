import schema from '../types.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();

export default function isType(value: object, type: string): boolean {
  const validate = ajv.compile(schema.definitions[type]);
  return validate(value);
}
