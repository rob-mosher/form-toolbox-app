// NOTE: ensure TTemplate is synchronized with ../../../api/src/types/

// TFormSchema is used to validate the structure being converted into schema.
export type TFormSchema = {
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
};

export type TTemplate = {
  id: string;
  isDeleted: boolean;
  // formSchema is stored as JSONB and automatically parsed by Sequelize
  formSchema: Record<string, TFormSchema>;
  formSchemaCount: number;
  formSchemaOrder: string[];
  name: string;
}
