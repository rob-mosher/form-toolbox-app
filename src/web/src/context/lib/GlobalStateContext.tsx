import { createContext, ReactNode } from 'react'

interface GlobalStateContextType {
  isContentFullSize: boolean;
  setIsContentFullSize: (value: boolean) => void;
  isModalOpen: boolean,
  setIsModalOpen: (value: boolean) => void,
  modalContent: ReactNode,
  setModalContent: (value: ReactNode | null) => void,
  showModal: (value: ReactNode) => void,
  hideModal: () => void,
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined)

export default GlobalStateContext
