import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Heading from '../components/Heading'
import TemplateDetails from '../components/TemplateDetails'
import type { TemplateType } from '../types'

type TemplateViewParams = {
  templateId: TemplateType['id']
}

export default function TemplateView() {
  const [template, setTemplate] = useState<TemplateType | null>(null)

  const { templateId } = useParams<TemplateViewParams>()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${templateId}`

  useEffect(() => {
    axios.get<TemplateType>(url)
      .then((resp) => {
        setTemplate(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load template.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
        console.error('Unable to load template:', error)
      })
  }, [url])

  if (!template) {
    return <Heading as='h2'>Template Details Loading...</Heading>
  }

  return (
    <>
      <Heading as='h2'>Template Details</Heading>
      <div className='p-4'>
        <TemplateDetails template={template} />
      </div>
    </>
  )
}
