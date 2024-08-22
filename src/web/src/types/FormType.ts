// ensure this file is synchronized with ../../../api/src/types/

import { FormItemType } from './FormItemType'

export type FormType = {
  createdAt: Date;
  id: string;
  analysisFolderNameS3?: string;
  createdAt: Date; // TODO also include 'updatedAt'?
  exportFolderNameS3?: string;
  fileName?: string;
  fileNameS3?: string;
  formDeclared?: Record<string, FormItemType>;
  formDetected?: Record<string, FormItemType>;
  isDeleted: boolean;
  pageCount?: number;
  status: 'analyzing' | 'error' | 'initialized' | 'ready' | 'uploading';
  templateId?: string;
  textractJobId?: string;
};
