import { TemplateType } from './TemplateType'

export type TemplateOptionType = {
  key: TemplateType['id'];
  value: TemplateType['id'];
  text: TemplateType['name'];
}
