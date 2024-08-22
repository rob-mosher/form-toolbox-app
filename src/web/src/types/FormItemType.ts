// ensure this file is synchronized with ../../../api/src/types/

import { BoundingBox as BoundingBoxType } from '@aws-sdk/client-textract'

export type FormItemType = {
  value: string;
  keyBoundingBox: BoundingBoxType;
  valueBoundingBox: BoundingBoxType;
};
