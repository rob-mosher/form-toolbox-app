/* eslint-disable import/prefer-default-export */

// If adding to global state, ensure their types are also added to ./lib/GlobalStateContext.tsx

import { useState, useMemo, ReactNode } from 'react'
import GlobalStateContext from './lib/GlobalStateContext'

interface GlobalStateProviderProps {
  children: ReactNode;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [isContentFullSize, setIsContentFullSize] = useState(false)
  const [isFormListReloadNeeded, setIsFormListReloadNeeded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

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

    hideModal,
    showModal,
  }), [isContentFullSize, isFormListReloadNeeded, isModalOpen, modalContent])

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}
