// TODO add check that form is ready for editing
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InformationCircle, PencilSquare } from '../assets'
import Content from '../components/Content'
import Heading from '../components/Heading'
import Tab from '../components/Tab'
import { mergeClassName } from '../lib/utils'
import EditTab from '../tabs/EditTab'
import InfoTab from '../tabs/InfoTab'
import type {
  Form, FormType, FormTypeOption, Schema
} from '../types'

type FnOutletContext = {
  setIsContentFullSize: (value: boolean) => void;
};

type FormEditParams = {
  formId: Form['id']
}

export default function FormEdit() {
  const [form, setForm] = useState<Form | null>(null)
  const [formTypes, setFormTypes] = useState<FormTypeOption[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [schema, setSchema] = useState<Schema | null>(null)
  const [activeTab, setActiveTab] = useState('edit')

  const { formId } = useParams<FormEditParams>()
  const { setIsContentFullSize } = useOutletContext<FnOutletContext>()

  useEffect(() => {
    // Enable full-size content mode when this component mounts
    setIsContentFullSize(true)

    // Disable full-size content mode when this component unmounts
    return () => setIsContentFullSize(false)
  }, [setIsContentFullSize])

  useEffect(() => {
    const formApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
    const formTypesApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes/`
    const imageApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}/image-urls`

    // Get formtypes
    axios.get<FormType[]>(formTypesApiUrl)
      .then((resp) => {
        const types = resp.data.map(({ id, name }) => (
          {
            key: id,
            value: id,
            text: name,
          }
        ))
        setFormTypes(types)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching formtypes:', error.message)
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
    axios.get<Form>(formApiUrl)
      .then(async (resp) => {
        const fetchedForm = resp.data

        // If formTypeId is set, set the schema
        if (fetchedForm.formTypeId) {
          try {
            const schemaResponse = await axios.get(`//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes/${fetchedForm.formTypeId}`)
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
          formId={formId}
          formTypes={formTypes}
          schema={schema}
          setForm={setForm}
          setSchema={setSchema}
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
    <div className='flex size-full'>
      <div className='grid h-full grid-cols-12 gap-3'>
        <div className='col-span-9 overflow-y-scroll'>
          <Content imageUrls={imageUrls} />
        </div>
        <div className='col-span-3 mr-3 overflow-x-hidden overflow-y-scroll'>
          <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className={mergeClassName(
            'p-3.5 border border-gray-300',
          )}
          >
            {tabContent}
          </div>
        </div>
      </div>
    </div>
  )
}
