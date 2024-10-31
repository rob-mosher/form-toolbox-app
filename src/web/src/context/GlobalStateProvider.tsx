/* eslint-disable import/prefer-default-export */

// If adding to global state, ensure their types are also added to ./lib/GlobalStateContext.tsx

import {
  useState, useMemo, ReactNode, useEffect,
} from 'react'
import GlobalStateContext from './lib/GlobalStateContext'
import {
  DEFAULT_USER_PREFS, userFormBgColors, userFormHighlightColors, userTabOverrideColors,
} from '../lib'
import type { TUserPrefs } from '../types'

const USER_PREFS_KEY = 'userPrefs'

interface GlobalStateProviderProps {
  children: ReactNode;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [isContentFullSize, setIsContentFullSize] = useState(false)
  const [isFormListReloadNeeded, setIsFormListReloadNeeded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  const [userPrefs, setUserPrefs] = useState<TUserPrefs>(() => {
    const storedPrefs = localStorage.getItem(USER_PREFS_KEY)
    if (!storedPrefs) return DEFAULT_USER_PREFS

    try {
      const parsedPrefs = JSON.parse(storedPrefs) as TUserPrefs

      // Validate stored preferences against available options
      // TODO convert to dynamic validator function
      if (!userFormBgColors[parsedPrefs.form.bgKey]
          || !userFormHighlightColors[parsedPrefs.form.highlightKey]
          || !userTabOverrideColors[parsedPrefs.tab.overrideKey]) {
        // eslint-disable-next-line no-console
        console.log('Invalid user preferences found, resetting to default')
        return DEFAULT_USER_PREFS
      }

      return parsedPrefs
    } catch (e) {
      return DEFAULT_USER_PREFS
    }
  })

  useEffect(() => {
    // TODO run userPrefs through validator before saving to localStorage
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(userPrefs))
  }, [userPrefs])

  const hideModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  const showModal = (content: ReactNode) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isContentFullSize,
    setIsContentFullSize,

    isFormListReloadNeeded,
    setIsFormListReloadNeeded,

    isModalOpen,
    setIsModalOpen,

    modalContent,
    setModalContent,

    userPrefs,
    setUserPrefs,

    hideModal,
    showModal,
  }), [isContentFullSize, isFormListReloadNeeded, isModalOpen, modalContent, userPrefs])

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}
