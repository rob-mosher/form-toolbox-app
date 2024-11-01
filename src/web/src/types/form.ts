// ensure this file is 'synchronized' with ../../../api/src/types/

import type { TFormItem } from './formItem'

export type TForm = {
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
};
