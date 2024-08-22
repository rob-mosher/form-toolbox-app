import { Optional } from 'sequelize'

export interface TemplateType {
  id: string;
  isDeleted: boolean;
  name: string;
  schema: string; // TODO might need to be more specific
}

export type TemplateCreationAttributes = Optional<TemplateType, 'id'>
