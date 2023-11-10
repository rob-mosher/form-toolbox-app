import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Table } from 'semantic-ui-react'

export default function FormEdit() {
  const [form, setForm] = useState(null)

  const { formId } = useParams()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`

  useEffect(() => {
    axios.get(url)
      .then((resp) => {
        setForm(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load form.', {
          autoClose: 5000,
        })
        console.error('Unable to load form:', error)
      })
  }, [url])

  if (!form) {
    return <Header as='h2'>Form Details Editor Loading...</Header>
  }

  return (
    <>
      <Header as='h2'>Form Details Editor</Header>
      <Header as='h3'>API Response:</Header>
      <code>
        {JSON.stringify(form)}
      </code>
    </>
  )
}