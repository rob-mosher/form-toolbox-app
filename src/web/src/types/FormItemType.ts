// ensure this file is synchronized with ../../../api/src/types/

import { BoundingBoxType } from './BoundingBoxType'

export type FormItemType = {
  value: string;
  keyBoundingBox: BoundingBoxType;
  valueBoundingBox: BoundingBoxType;
};
