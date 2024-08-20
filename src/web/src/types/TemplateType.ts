export type SchemaField = {
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export type TemplateType = {
  id: string; // uuidv4
  name: string;
  schema: SchemaField;
}
