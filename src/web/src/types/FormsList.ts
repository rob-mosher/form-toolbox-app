// used by the Forms page, which shows a list of Forms

import { Form } from './Form'

export type FormsList = Form & {
  formType: {
    name: string;
  };
};
