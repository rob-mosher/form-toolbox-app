import { Optional } from 'sequelize'

export interface TTemplate {
  id: string;
  isDeleted: boolean;
  name: string;
  schema: string; // TODO might need to be more specific
}

export type TTemplateCreationAttributes = Optional<TTemplate, 'id'>
