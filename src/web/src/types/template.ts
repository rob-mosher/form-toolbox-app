// NOTE: ensure TTemplate is synchronized with ../../../api/src/types/

// TSchemaField is used to validate the structure being converted into schemaJSON.
export type TSchemaField = {
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export type TTemplate = {
  id: string; // uuidv4
  isDeleted: boolean;
  name: string;
  // schemaJSON is stored as JSONB and automatically parsed by Sequelize
  schemaFieldCount: number;
  schemaJSON: Record<string, TSchemaField>;
}
