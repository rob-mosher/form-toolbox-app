// NOTE Ensure any changes to path are also reflected in ../router.tsx

import {
  ReactNode, useEffect, useMemo, useState
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'

function matchesPath(basePath: string, normalizedPath: string): boolean {
  return normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)
}

export default function usePathLogic(): ReactNode {
  const [headerButton, setHeaderButton] = useState<ReactNode | undefined>(undefined)

  const location = useLocation()
  const navigate = useNavigate()

  const buttons = useMemo(
    () => ({
      newForm: (
        <Button ariaLabel='New Form' primary onClick={() => navigate('/upload')}>
          New Form
        </Button>
      ),
      newTemplate: (
        // TODO implement destination for onClick
        <Button ariaLabel='New Template' primary onClick={() => navigate('#')}>
          New Template
        </Button>
      ),
    }),
    [navigate],
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
    <>{headerButton}</>
  )
}
