// ensure the contents of this file are identical to ../../../web/src/types/

import { BoundingBox as BoundingBoxType } from '@aws-sdk/client-textract'

export type FormItemType = {
  value: string;
  keyBoundingBox: BoundingBoxType;
  valueBoundingBox: BoundingBoxType;
};
