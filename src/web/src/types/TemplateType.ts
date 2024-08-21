// ensure this file is synchronized with ../../../api/src/models/

export type SchemaField = {
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export type TemplateType = {
  id: string; // uuidv4
  isDeleted: boolean;
  name: string;
  schema: SchemaField;
}
