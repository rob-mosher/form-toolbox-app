// ensure this file is synchronized with ../../../api/src/types/

// TODO possibly rename to something like TextractKeyValueAndBoundingBoxesType or SchemaType

import { BoundingBoxType } from './BoundingBoxType'

export type FormDataValueType = {
  value: string;
  keyBoundingBox: BoundingBoxType;
  valueBoundingBox: BoundingBoxType;
};
