import type { TUserPrefs } from '../../types'

export * from './styleOptions'

export const DEFAULT_USER_PREFS: TUserPrefs = {
  form: {
    bgKey: 'mediumGray',
    highlightKey: 'yellow',
  },
  tab: {
    overrideKey: 'green',
  },
} as const
