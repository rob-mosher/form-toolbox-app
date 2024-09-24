// ensure this file is 'synchronized' with ../../../api/src/types/

import type { TFormItem } from './formItem'

export type TForm = {
  id: string;
  analysisFolderNameS3?: string;
  createdAt: Date;
  exportFolderNameS3?: string;
  fileName?: string;
  fileNameS3?: string;
  formDeclared?: Record<string, TFormItem>;
  formDetected?: Record<string, TFormItem>;
  isDeleted: boolean;
  pageCount?: number;
  status: 'analyzing' | 'error' | 'initializing' | 'ready' | 'uploading';
  templateId?: string;
  textractJobId?: string;
  updatedAt: Date;
};
