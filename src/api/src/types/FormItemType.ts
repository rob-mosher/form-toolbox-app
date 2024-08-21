// ensure the contents of this file are identical to ../../../web/src/types/

import { BoundingBoxType } from './BoundingBoxType'

export type FormItemType = {
  value: string;
  keyBoundingBox: BoundingBoxType;
  valueBoundingBox: BoundingBoxType;
};
