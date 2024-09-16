// NOTE Ensure any changes to path are also reflected in ../router.tsx

import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CommonButtons from './CommonButtons'

function matchesPath(basePath: string, normalizedPath: string): boolean {
  return normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)
}

export default function HeaderButton(): ReactNode {
  const [headerButton, setHeaderButton] = useState<ReactNode | undefined>(undefined)
  const location = useLocation()

  useEffect(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '')

    let newButton
    switch (true) {
      case matchesPath('/forms', normalizedPath):
        newButton = <CommonButtons variant='newForm' />
        break

      case matchesPath('/templates', normalizedPath):
        newButton = <CommonButtons variant='newTemplate' />
        break

        // Add more cases here as needed

      default:
        newButton = undefined
    }

    setHeaderButton(newButton)
  }, [location.pathname])

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {headerButton}
    </>
  )
}
