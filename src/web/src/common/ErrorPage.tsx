import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

export default function ErrorPage() {
  const error = useRouteError()
  // eslint-disable-next-line no-console
  console.error(error)

  let errorMessage = (
    <>
      <Header as='h2'>Error</Header>
      <p>Sorry, an unexpected error has occurred.</p>
    </>
  )
  if (isRouteErrorResponse(error)) {
    errorMessage = (
      <>
        <Header as='h2'>
          Error
          {' '}
          {error.status}
        </Header>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </>
    )
  }

  return (
    <div id='error-page'>
      {errorMessage}
    </div>
  )
}
