// NOTE Ensure any changes to path are also reflected in ../router.tsx

import {
  ReactNode, useEffect, useMemo, useState
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'
import { useGlobalState } from '../context/useGlobalState'
import ModalUploadForm from '../modals/ModalUploadForm'

function matchesPath(basePath: string, normalizedPath: string): boolean {
  return normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)
}

export default function usePathLogic(): ReactNode {
  const [headerButton, setHeaderButton] = useState<ReactNode | undefined>(undefined)
  const { hideModal, showModal } = useGlobalState()

  const location = useLocation()
  const navigate = useNavigate()

  const buttons = useMemo(
    () => ({
      newForm: (
        <Button
          ariaLabel='New Form'
          primary
          onClick={() => {
            showModal(
              <ModalUploadForm
                hideModal={hideModal}
              />,
            )
          }}
        >
          New Form
        </Button>
      ),
      newTemplate: (
        <Button ariaLabel='New Template' primary onClick={() => navigate('upload')}>
          New Template
        </Button>
      ),
    }),
    [hideModal, showModal, navigate],
  )

  useEffect(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '')

    let newButton
    switch (true) {
      case matchesPath('/forms', normalizedPath):
        newButton = buttons.newForm
        break

      case matchesPath('/templates', normalizedPath):
        newButton = buttons.newTemplate
        break

        // Add more cases here as needed

      default:
        newButton = undefined
    }

    setHeaderButton(newButton)
  }, [buttons, location.pathname])

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {headerButton}
    </>
  )
}
