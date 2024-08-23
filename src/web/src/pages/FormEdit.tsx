// TODO add check that form is ready for editing

import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CogSixTooth, InformationCircle, PencilSquare } from '../assets'
import Content from '../components/Content'
import Heading from '../components/Heading'
import Tab from '../components/Tab'
import { useGlobalState } from '../context/useGlobalState'
import { formUserBgColors, formUserHighlightColors, mergeClassName } from '../lib'
import EditTab from '../tabs/form/EditTab'
import InfoTab from '../tabs/form/InfoTab'
import SettingsTab from '../tabs/form/SettingsTab'
import type {
  TFormUserBgKeys, TFormUserHighlightKey, TForm, TTemplate, TTemplateOption,
} from '../types'

type FormEditParams = {
  formId: TForm['id']
}

export default function FormEdit() {
  const [activeTab, setActiveTab] = useState('edit')
  const [focusedBoundingBox, setFocusedBoundingBox] = useState<TBoundingBox[]>([])
  const [form, setForm] = useState<TForm | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [schema, setSchema] = useState<TTemplate['schema'] | null>(null)
  const [templates, setTemplates] = useState<TTemplateOption[]>([])

  const [formUserBgKey, setFormUserBgKey] = useState<TFormUserBgKeys>(() => {
    const storedFormUserBgKey = localStorage.getItem('formUserBgKey')
    return storedFormUserBgKey && formUserBgColors[storedFormUserBgKey] ? storedFormUserBgKey : 'mediumGray'
  })

  const [formUserHighlightKey, setFormUserHighlightKey] = useState<TFormUserHighlightKey>(() => {
    const storedFormUserHighlightKey = localStorage.getItem('formUserHighlightKey')
    return storedFormUserHighlightKey && formUserHighlightColors[storedFormUserHighlightKey] ? storedFormUserHighlightKey : 'yellow'
  })

  const { formId } = useParams<FormEditParams>()
  const { setIsContentFullSize } = useGlobalState()

  const updateFormUserBgKey = useCallback(
    (newFormUserBgKey: TFormUserBgKeys) => {
      if (newFormUserBgKey && formUserBgColors[newFormUserBgKey]) {
        setFormUserBgKey(newFormUserBgKey)
      } else {
        console.log('Invalid formUserBgKey:', newFormUserBgKey)
      }
    },
    [setFormUserBgKey],
  )

  const updateFormUserHighlightKey = useCallback(
    (newFormUserHighlightKey: TFormUserHighlightKey) => {
      if (newFormUserHighlightKey && formUserHighlightColors[newFormUserHighlightKey]) {
        setFormUserHighlightKey(newFormUserHighlightKey)
      } else {
        console.log('Invalid formUserHighlightKey:', newFormUserHighlightKey)
      }
    },
    [setFormUserHighlightKey],
  )

  useEffect(() => {
    // Enable full-size content mode when this component mounts
    setIsContentFullSize(true)

    // Disable full-size content mode when this component unmounts
    return () => setIsContentFullSize(false)
  }, [setIsContentFullSize])

  useEffect(() => {
    localStorage.setItem('formUserBgKey', formUserBgKey)
  }, [formUserBgKey])

  useEffect(() => {
    localStorage.setItem('formUserHighlightKey', formUserHighlightKey)
  }, [formUserHighlightKey])

  useEffect(() => {
    const formApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
    const templateApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/`
    const imageApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}/image-urls`

    // Get templates
    axios.get<TTemplate[]>(templateApiUrl)
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
    axios.get<TForm>(formApiUrl)
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
        // clear to setSchema first, since setForm's formDeclared depends on schema to exist upon.
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
    keyBoundingBox: TBoundingBox,
    valueBoundingBox: TBoundingBox,
  }) => {
    setFocusedBoundingBox([boundingBox.keyBoundingBox, boundingBox.valueBoundingBox])
  }

  const tabs = [
    { key: 'edit', content: 'Edit', icon: <PencilSquare /> },
    { key: 'info', content: 'Info', icon: <InformationCircle /> },
    { key: 'settings', content: 'Settings', icon: <CogSixTooth /> },
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

    case 'settings':

      tabContent = (
        <SettingsTab
          // TODO match chosen color and style accordingly
          // formUserBgKey={formUserBgKey}
          // formUserHighlightKey={formUserHighlightKey}
          updateFormUserBgKey={updateFormUserBgKey}
          updateFormUserHighlightKey={updateFormUserHighlightKey}
        />
      )
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
        <div className={mergeClassName(
          'col-span-9 overflow-y-scroll shadow-inner',
          formUserBgColors[formUserBgKey].className,
        )}
        >
          <Content
            focusedBoundingBox={focusedBoundingBox}
            formUserHighlightKey={formUserHighlightKey}
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
