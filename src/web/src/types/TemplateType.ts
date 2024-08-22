// ensure this file is synchronized with ../../../api/src/types/

// schema is stored as JSONB (a string, essentially) so use ParsedSchemaType for type checking

export type SchemaFieldType = { // WIP
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export type TemplateType = {
  id: string; // uuidv4
  isDeleted: boolean;
  name: string;
  schema: string; // NOTE: see above
}
