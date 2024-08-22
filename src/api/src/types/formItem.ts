// ensure the contents of this file are identical to ../../../web/src/types/

import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'

export type TFormItem = {
  value: string;
  keyBoundingBox: TBoundingBox;
  valueBoundingBox: TBoundingBox;
};
