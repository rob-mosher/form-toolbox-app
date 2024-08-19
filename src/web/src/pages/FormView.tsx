import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormDetails from '../components/FormDetails'
import Heading from '../components/Heading'
import type { FormType } from '../types'

type FormViewParams = {
  formId: FormType['id']
}

export default function FormView() {
  const [form, setForm] = useState<FormType | null>(null)

  const { formId } = useParams<FormViewParams>()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`

  useEffect(() => {
    axios.get<FormType>(url)
      .then((resp) => {
        setForm(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load form.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
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
        <FormDetails form={form} />
      </div>
    </>
  )
}
