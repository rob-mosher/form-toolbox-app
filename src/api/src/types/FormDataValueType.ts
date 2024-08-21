// ensure the contents of this file are identical to ../../../web/src/types/

// TODO possibly rename to something like TextractKeyValueAndBoundingBoxesType or SchemaType

import { BoundingBoxType } from './BoundingBoxType'

export type FormDataValueType = {
  value: string;
  keyBoundingBox: BoundingBoxType;
  valueBoundingBox: BoundingBoxType;
};
