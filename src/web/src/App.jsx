import { useEffect, useState } from 'react'

const VITE_API_PORT = import.meta.env.VITE_API_PORT || 3000

export default function App() {
  const [apiResponse, setApiResponse] = useState('Loading.')

  useEffect(() => {
    fetch(`//localhost:${VITE_API_PORT}/`)
      .then((resp) => {
        if (resp.ok) setApiResponse(resp.status)
        else throw new Error(resp.status)
      })
      .catch((err) => setApiResponse(err.toString()))
  }, [])

  return (
    <>
      <h1>Form Toolbox</h1>
      <p>
        API Response:
        {' '}
        {apiResponse}
      </p>
    </>
  )
}
