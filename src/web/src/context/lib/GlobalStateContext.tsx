import { createContext, ReactNode } from 'react'

interface TGlobalStateContext {
  isContentFullSize: boolean;
  setIsContentFullSize: (value: boolean) => void;
  isModalOpen: boolean,
  setIsModalOpen: (value: boolean) => void,
  modalContent: ReactNode,
  setModalContent: (value: ReactNode | null) => void,
  showModal: (value: ReactNode) => void,
  hideModal: () => void,
}

const GlobalStateContext = createContext<TGlobalStateContext | undefined>(undefined)

export default GlobalStateContext
