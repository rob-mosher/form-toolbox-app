// ensure this file is 'synchronized' with ../../../web/src/types/

import { Optional } from 'sequelize'
import type { TFormItem } from './formItem'

export interface TForm {
  id: string;
  analysisFolderNameS3?: string;
  createdAt: Date;
  fileName?: string;
  fileNameS3?: string;
  formDeclared?: Record<string, TFormItem>;
  formDetected?: Record<string, TFormItem>;
  isDeleted: boolean;
  pageCount?: number;
  previewFolderNameS3?: string;
  status: 'analyzing' | 'error' | 'initializing' | 'ready' | 'uploading';
  templateId?: string;
  textractJobId?: string;
  updatedAt: Date;
}

// Sequelize provides the `id` automatically as a primary key during record creation.
// The `isDeleted` field is non-optional in the model but has a default value of `false`
// which Sequelize applies automatically if not provided during instantiation.
export type TFormCreationAttributes = Optional<TForm, 'createdAt' | 'id' | 'isDeleted' | 'updatedAt'>;
