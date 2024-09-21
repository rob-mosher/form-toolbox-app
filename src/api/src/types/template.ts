// NOTE: ensure TTemplate is synchronized with ../../../web/src/types

import { Optional } from 'sequelize'

export interface TTemplate {
  id: string;
  isDeleted: boolean;
  name: string;
  // schemaJSON is stored as JSONB, which is essentially a string of JSON data.
  schemaJSON: string;
}

export type TTemplateCreationAttributes = Optional<TTemplate, 'id'>
