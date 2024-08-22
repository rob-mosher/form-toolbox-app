// ensure this file is synchronized with ../../../api/src/types/

import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'

export type TFormItem = {
  value: string;
  keyBoundingBox: TBoundingBox;
  valueBoundingBox: TBoundingBox;
};
