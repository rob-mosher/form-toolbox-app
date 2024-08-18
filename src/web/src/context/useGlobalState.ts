/* eslint-disable import/prefer-default-export */
import { useContext } from 'react'
import GlobalStateContext from './lib/GlobalStateContext'

export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}
