import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormDetails from '../common/FormDetails'
import Heading from '../components/Heading'
import type { Form } from '../types'

type FormViewParams = {
  formId: Form['id']
}

export default function FormView() {
  const [form, setForm] = useState<Form | null>(null)

  const { formId } = useParams<FormViewParams>()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`

  useEffect(() => {
    axios.get<Form>(url)
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
    return <Heading as='h2'>Form Details Loading...</Heading>
  }

  return (
    <>
      <Heading as='h2'>Form Details</Heading>
      <div className='p-4'>
        <code>
          <FormDetails form={form} />
        </code>
      </div>
    </>
  )
}
