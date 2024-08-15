import { useEffect, useState } from 'react'
import Heading from '../components/Heading'

const VITE_API_PORT = import.meta.env.VITE_API_PORT || 3000

export default function Home() {
  const [apiResponse, setApiResponse] = useState('Loading.')

  useEffect(() => {
    fetch(`//localhost:${VITE_API_PORT}/`)
      .then((resp) => {
        if (resp.ok) setApiResponse(resp.status.toString())
        else throw new Error(resp.status.toString())
      })
      .catch((err) => setApiResponse(err.toString()))
  }, [])

  return (
    <>
      <Heading as='h2'>Home</Heading>
      <p>
        API Response:
        {' '}
        {apiResponse}
      </p>

    </>
  )
}
