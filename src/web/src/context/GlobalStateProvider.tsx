// If adding to global state, ensure their types are also added to ./lib/GlobalStateContext.tsx

import { useState, useMemo, ReactNode } from 'react'
import GlobalStateContext from './lib/GlobalStateContext'

interface GlobalStateProviderProps {
  children: ReactNode;
}

export default function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [isContentFullSize, setIsContentFullSize] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  const showModal = (content: ReactNode) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  const hideModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isContentFullSize,
    setIsContentFullSize,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    setModalContent,
    showModal,
    hideModal,
  }), [isContentFullSize, isModalOpen, modalContent])

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}
