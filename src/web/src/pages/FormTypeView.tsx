import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormTypeDetails from '../components/FormTypeDetails'
import Heading from '../components/Heading'
import type { FormType } from '../types'

type FormTypeViewParams = {
  formTypeId: FormType['id']
}

export default function FormTypeView() {
  const [formType, setFormType] = useState<FormType | null>(null)

  const { formTypeId } = useParams<FormTypeViewParams>()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes/${formTypeId}`

  useEffect(() => {
    axios.get<FormType>(url)
      .then((resp) => {
        setFormType(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load formType.', {
          autoClose: 5000,
        })
        console.error('Unable to load formType:', error)
      })
  }, [url])

  if (!formType) {
    return <Heading as='h2'>Form Type Details Loading...</Heading>
  }

  return (
    <>
      <Heading as='h2'>Form Type Details</Heading>
      <div className='p-4'>
        <FormTypeDetails formType={formType} />
      </div>
    </>
  )
}
