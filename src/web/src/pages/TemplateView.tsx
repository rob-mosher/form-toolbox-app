import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Heading from '../components/Heading'
import TemplateDetails from '../components/TemplateDetails'
import { API_ENDPOINT } from '../lib'
import type { TTemplate } from '../types'

type TemplateViewParams = {
  templateId: TTemplate['id']
}

export default function TemplateView() {
  const [template, setTemplate] = useState<TTemplate | null>(null)

  const { templateId } = useParams<TemplateViewParams>()

  const apiUrl = `${API_ENDPOINT}/api/templates/${templateId}`

  useEffect(() => {
    axios.get<TTemplate>(apiUrl)
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
  }, [apiUrl])

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
