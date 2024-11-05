// NOTE: ensure TTemplate is synchronized with ../../../web/src/types/

import { Optional } from 'sequelize'

// TFormSchema is used to validate the structure being converted into schema.
export type TFormSchema = {
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export interface TTemplate {
  id: string;
  isDeleted: boolean;
  // formSchema is stored as JSONB and automatically parsed by Sequelize
  formSchema: Record<string, TFormSchema>;
  formSchemaCount: number;
  name: string;
}

export type TTemplateCreationAttributes = Optional<TTemplate, 'id' | 'formSchemaCount'>
