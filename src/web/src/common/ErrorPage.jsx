import { useRouteError } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

export default function ErrorPage() {
  const error = useRouteError()
  // eslint-disable-next-line no-console
  console.error(error)

  return (
    <div id='error-page'>
      <Header as='h2'>Error</Header>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}
