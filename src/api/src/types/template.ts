// NOTE: ensure TTemplate is synchronized with ../../../web/src/types/

import { Optional } from 'sequelize'

// TSchemaField is used to validate the structure being converted into schemaJSON.
export type TSchemaField = {
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export interface TTemplate {
  id: string;
  isDeleted: boolean;
  name: string;
  schemaFieldCount: number;
  // schemaJSON is stored as JSONB and automatically parsed by Sequelize
  schemaJSON: Record<string, TSchemaField>;
}

export type TTemplateCreationAttributes = Optional<TTemplate, 'id' | 'schemaFieldCount'>
