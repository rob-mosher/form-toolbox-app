import { userFormBgColors, userFormHighlightColors, userTabOverrideColors } from '../lib'

export type TUserPrefs = {
  form: {
    bgKey: keyof typeof userFormBgColors
    highlightKey: keyof typeof userFormHighlightColors
  }
  tab: {
    overrideKey: keyof typeof userTabOverrideColors
  }
}
