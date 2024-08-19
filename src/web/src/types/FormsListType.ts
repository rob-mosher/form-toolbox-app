// used by the Forms page, which shows a list of Forms

import { FormType } from './FormType'

export type FormsListType = FormType & {
  template: {
    name: string;
  };
};
