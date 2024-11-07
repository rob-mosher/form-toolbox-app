export const API_ENDPOINT = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}`

export const STORAGE_KEYS = {
  USER_PREFS: 'userPrefs',
} as const
