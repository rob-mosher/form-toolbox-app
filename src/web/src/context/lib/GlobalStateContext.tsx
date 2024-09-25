import { createContext, ReactNode } from 'react'

interface TGlobalStateContext {
  isContentFullSize: boolean;
  setIsContentFullSize: (value: boolean) => void;

  isFormListReloadNeeded: boolean;
  setIsFormListReloadNeeded: (value: boolean) => void;

  isModalOpen: boolean,
  setIsModalOpen: (value: boolean) => void,

  modalContent: ReactNode,
  setModalContent: (value: ReactNode | null) => void,

  hideModal: () => void,
  showModal: (value: ReactNode) => void,
}

const GlobalStateContext = createContext<TGlobalStateContext | undefined>(undefined)

export default GlobalStateContext
