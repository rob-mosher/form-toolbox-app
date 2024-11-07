import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CogSixTooth, InformationCircle, PencilSquare } from '../assets'
import Canvas from '../components/Canvas'
import Heading from '../components/Heading'
import Tab from '../components/Tab'
import { useGlobalState } from '../context/useGlobalState'
import {
  API_ENDPOINT,
  mergeClassName,
  userFormBgColors,
  userFormHighlightColors,
  userTabOverrideColors,
} from '../lib'
import EditTab from '../tabs/form/EditTab'
import InfoTab from '../tabs/form/InfoTab'
import SettingsTab from '../tabs/form/SettingsTab'
import type {
  TForm,
  TTab,
  TTemplate,
  TTemplateOption,
  TUserPrefs,
  TFormSchema,
} from '../types'

type FormEditParams = {
  formId: TForm['id']
}

export default function FormEdit() {
  const [activeTab, setActiveTab] = useState('edit')
  const [focusedBoundingBox, setFocusedBoundingBox] = useState<TBoundingBox[]>([])
  const [form, setForm] = useState<TForm | null>(null)
  const [formSchema, setFormSchema] = useState<Record<string, TFormSchema>>({})
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [templates, setTemplates] = useState<TTemplateOption[]>([])
  const { userPrefs, setUserPrefs } = useGlobalState()
  const { formId } = useParams<FormEditParams>()
  const { setIsCanvasFullSize } = useGlobalState()
  const navigate = useNavigate()

  const updateUserFormBgKey = useCallback(
    (newUserFormBgKey: TUserPrefs['form']['bgKey']) => {
      if (newUserFormBgKey && userFormBgColors[newUserFormBgKey]) {
        setUserPrefs((prev) => ({
          ...prev,
          form: { ...prev.form, bgKey: newUserFormBgKey },
        }))
      } else {
        // eslint-disable-next-line no-console
        console.log('Invalid userFormBgKey:', newUserFormBgKey)
      }
    },
    [setUserPrefs],
  )

  const updateUserFormHighlightKey = useCallback(
    (newUserFormHighlightKey: TUserPrefs['form']['highlightKey']) => {
      if (newUserFormHighlightKey && userFormHighlightColors[newUserFormHighlightKey]) {
        setUserPrefs((prev) => ({
          ...prev!,
          form: { ...prev!.form, highlightKey: newUserFormHighlightKey },
        }))
      } else {
        // eslint-disable-next-line no-console
        console.log('Invalid userFormHighlightKey:', newUserFormHighlightKey)
      }
    },
    [setUserPrefs],
  )

  const updateUserTabOverrideKey = useCallback(
    (newUserTabOverrideKey: TUserPrefs['tab']['overrideKey']) => {
      if (newUserTabOverrideKey && userTabOverrideColors[newUserTabOverrideKey]) {
        setUserPrefs((prev) => ({
          ...prev!,
          tab: { ...prev!.tab, overrideKey: newUserTabOverrideKey },
        }))
      } else {
        // eslint-disable-next-line no-console
        console.log('Invalid userTabOverrideKey:', newUserTabOverrideKey)
      }
    },
    [setUserPrefs],
  )

  useEffect(() => {
    // Enable full-size canvas mode when this component mounts
    setIsCanvasFullSize(true)

    // Disable full-size canvas mode when this component unmounts
    return () => setIsCanvasFullSize(false)
  }, [setIsCanvasFullSize])

  useEffect(() => {
    const formApiUrl = `${API_ENDPOINT}/api/forms/${formId}`
    const templateApiUrl = `${API_ENDPOINT}/api/templates/`
    const imageApiUrl = `${API_ENDPOINT}/api/forms/${formId}/image-urls`

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

        if (resp.data.status !== 'ready') {
          // NOTE renders twice when in dev strict mode
          toast.warning('Form is not ready for editing', {
            autoClose: 5000,
          })
          navigate('/forms')
          return
        }

        // If templateId is set, set the formSchema
        if (fetchedForm.templateId) {
          try {
            const formSchemaResponse = await axios.get(`${API_ENDPOINT}/api/templates/${fetchedForm.templateId}`)
            setFormSchema(formSchemaResponse.data.formSchema)
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching formSchema:', error)
          }
        }

        // It should be fine to setForm before setFormSchema due to how React works, but it seems
        // more clear to setFormSchema first, since setForm's formDeclared depends on formSchema to
        // exist upon.
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

  const tabs: TTab[] = [
    { id: 'edit', content: 'Edit', icon: <PencilSquare /> },
    { id: 'info', content: 'Info', icon: <InformationCircle /> },
    { id: 'settings', content: 'Settings', icon: <CogSixTooth /> },
  ]

  let tabCanvas
  switch (activeTab) {
    case 'edit':
      tabCanvas = (
        <EditTab
          form={form}
          formId={formId!} // regarding '!', formId is part of the URL via useParams
          formSchema={formSchema}
          onBoundingBoxFocus={handleBoundingBoxFocus}
          setForm={setForm}
          setFormSchema={setFormSchema}
          templates={templates}
          userTabOverrideKey={userPrefs.tab.overrideKey}
        />
      )
      break
    case 'info':
      tabCanvas = <InfoTab form={form} />
      break

    case 'settings':
      tabCanvas = (
        <SettingsTab
          updateUserFormBgKey={updateUserFormBgKey}
          updateUserFormHighlightKey={updateUserFormHighlightKey}
          updateUserTabOverrideKey={updateUserTabOverrideKey}
          userFormBgKey={userPrefs.form.bgKey}
          userFormHighlightKey={userPrefs.form.highlightKey}
          userTabOverrideKey={userPrefs.tab.overrideKey}
        />
      )
      break

    default:
      // eslint-disable-next-line no-console
      console.warn(`Invalid tab '${activeTab}'`)
      tabCanvas = (
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
          userFormBgColors[userPrefs.form.bgKey].className,
        )}
        >
          <Canvas
            focusedBoundingBox={focusedBoundingBox}
            imageUrls={imageUrls}
            userFormHighlightKey={userPrefs.form.highlightKey}
          />
        </div>
        <div className='col-span-3 mr-3 overflow-x-hidden overflow-y-scroll'>
          <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className='border border-gray-300 p-3.5'>
            {tabCanvas}
          </div>
        </div>
      </div>
    </div>
  )
}
