import { createContext } from 'react'

interface GlobalStateContextType {
  isContentFullSize: boolean;
  setIsContentFullSize: (value: boolean) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined)

export default GlobalStateContext
