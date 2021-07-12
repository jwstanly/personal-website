import schema from '../types.schema.json';

export default function getTypeDefinition(type: string | object): object {
  return typeof type === 'object' ? type : schema.definitions[type];
}
