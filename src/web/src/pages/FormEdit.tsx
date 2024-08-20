// TODO add check that form is ready for editing

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InformationCircle, PencilSquare } from '../assets'
import Content from '../components/Content'
import Heading from '../components/Heading'
import Tab from '../components/Tab'
import { useGlobalState } from '../context/useGlobalState'
import EditTab from '../tabs/EditTab'
import InfoTab from '../tabs/InfoTab'
import type {
  BoundingBoxType, FormType, TemplateType, TemplateOptionType
} from '../types'

type FormEditParams = {
  formId: FormType['id']
}

export default function FormEdit() {
  const [form, setForm] = useState<FormType | null>(null)
  const [templates, setTemplates] = useState<TemplateOptionType[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [schema, setSchema] = useState<TemplateType['schema'] | null>(null)
  const [activeTab, setActiveTab] = useState('edit')
  const [focusedBoundingBox, setFocusedBoundingBox] = useState<BoundingBoxType[]>([])

  const { formId } = useParams<FormEditParams>()
  const { setIsContentFullSize } = useGlobalState()

  useEffect(() => {
    // Enable full-size content mode when this component mounts
    setIsContentFullSize(true)

    // Disable full-size content mode when this component unmounts
    return () => setIsContentFullSize(false)
  }, [setIsContentFullSize])

  useEffect(() => {
    const formApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
    const templateApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/`
    const imageApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}/image-urls`

    // Get templates
    axios.get<TemplateType[]>(templateApiUrl)
      .then((resp) => {
        const newTemplates = resp.data.map(({ id, name }) => (
          {
            key: id,
            value: id,
            text: name,
          }
        ))
        setTemplates(newTemplates)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching templates:', error.message)
      })

    // Get form images/pages
    axios.get<string[]>(imageApiUrl)
      .then((resp) => {
        setImageUrls(resp.data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching presigned URLs:', error.message)
      })

    // Get form data
    axios.get<FormType>(formApiUrl)
      .then(async (resp) => {
        const fetchedForm = resp.data

        // If templateId is set, set the schema
        if (fetchedForm.templateId) {
          try {
            const schemaResponse = await axios.get(`//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${fetchedForm.templateId}`)
            setSchema(schemaResponse.data[0].schema)
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching schema:', error)
          }
        }

        // It should be fine to setForm before setSchema due to how React works, but it seems more
        // clear to setSchema first, since setForm's formData depends on schema to exist upon.
        setForm(fetchedForm)
      })
      .catch((error) => {
        toast.error('Error: Unable to load form.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
        console.error('Unable to load form:', error.message)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // formId is not a dependency because it is used in the URL

  if (!form) {
    return <Heading as='h2'>Form Details Editor Loading...</Heading>
  }

  const handleBoundingBoxFocus = (boundingBox: {
    keyBoundingBox: BoundingBoxType,
    valueBoundingBox: BoundingBoxType,
  }) => {
    setFocusedBoundingBox([boundingBox.keyBoundingBox, boundingBox.valueBoundingBox])
  }

  const tabs = [
    { key: 'edit', content: 'Edit', icon: <PencilSquare /> },
    { key: 'info', content: 'Info', icon: <InformationCircle /> },
  ]

  let tabContent
  switch (activeTab) {
    case 'edit':
      tabContent = (
        <EditTab
          form={form}
          formId={formId!} // regarding '!', formId is part of the URL via useParams
          schema={schema}
          setForm={setForm}
          setSchema={setSchema}
          templates={templates}
          onBoundingBoxFocus={handleBoundingBoxFocus}
        />
      )
      break
    case 'info':
      tabContent = <InfoTab form={form} />
      break
    default:
      // eslint-disable-next-line no-console
      console.warn(`Invalid tab '${activeTab}'`)
      tabContent = (
        <div className='text-center text-red-700'>
          Invalid tab
        </div>
      )
  }

  return (
    <div className='flex h-full'>
      <div className='grid w-full grid-cols-12 gap-3'>
        <div className='col-span-9 overflow-y-scroll'>
          <Content
            focusedBoundingBox={focusedBoundingBox}
            imageUrls={imageUrls}
          />
        </div>
        <div className='col-span-3 mr-3 overflow-x-hidden overflow-y-scroll'>
          <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className='border border-gray-300 p-3.5'>
            {tabContent}
          </div>
        </div>
      </div>
    </div>
  )
}
