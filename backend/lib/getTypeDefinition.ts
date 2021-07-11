import schema from '../types.schema.json';

export default function getTypeDefinition(type: string): object {
  return schema.definitions[type];
}
