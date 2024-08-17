import { Outlet, useOutletContext } from 'react-router-dom'

export default function MainWrapper() {
  const context = useOutletContext()

  return (
    <main>
      <Outlet context={context} />
    </main>
  )
}
