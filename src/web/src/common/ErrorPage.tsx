import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import Heading from '../components/Heading'

export default function ErrorPage() {
  const error = useRouteError()
  // eslint-disable-next-line no-console
  console.error(error)

  let errorMessage = (
    <>
      <Heading as='h2'>Error</Heading>
      <p>Sorry, an unexpected error has occurred.</p>
    </>
  )
  if (isRouteErrorResponse(error)) {
    errorMessage = (
      <>
        <Heading as='h2'>
          Error
          {' '}
          {error.status}
        </Heading>
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
