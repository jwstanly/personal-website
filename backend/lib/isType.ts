import getTypeDefinition from './getTypeDefinition';
import Ajv from 'ajv';

const ajv = new Ajv();

export default function isType(value: object, type: string | object): boolean {
  const validate = ajv.compile(getTypeDefinition(type));
  return validate(value);
}
