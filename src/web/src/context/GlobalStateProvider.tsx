import { useState, useMemo, ReactNode } from 'react'
import GlobalStateContext from './lib/GlobalStateContext'

interface GlobalStateProviderProps {
  children: ReactNode;
}

export default function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [isContentFullSize, setIsContentFullSize] = useState(false)

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isContentFullSize,
    setIsContentFullSize,
  }), [isContentFullSize])

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}
