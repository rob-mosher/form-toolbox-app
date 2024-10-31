import type { TTemplate } from './template'

export type TTemplateOption = {
  // TODO: consider renaming 'key' to 'id' (similar to `./tab.ts`)
  key: TTemplate['id'];
  value: TTemplate['id'];
  text: TTemplate['name'];
}
