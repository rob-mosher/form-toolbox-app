import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormDetails from '../components/FormDetails'
import Heading from '../components/Heading'
import { API_ENDPOINT } from '../lib'
import type { TForm } from '../types'

type FormViewParams = {
  formId: TForm['id']
}

export default function FormView() {
  const [form, setForm] = useState<TForm | null>(null)

  const { formId } = useParams<FormViewParams>()

  const apiUrl = `${API_ENDPOINT}/api/forms/${formId}`

  useEffect(() => {
    axios.get<TForm>(apiUrl)
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
  }, [apiUrl])

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
