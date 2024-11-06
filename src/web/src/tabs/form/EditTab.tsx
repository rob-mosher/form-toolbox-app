import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'
import axios from 'axios'
import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/Button'
import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import { mergeClassName, userTabOverrideColors } from '../../lib'
import type {
  TForm, TFormItem, TFormSchema, TTemplate, TTemplateOption, TUserPrefs,
} from '../../types'

type EditTabProps = {
  form: TForm;
  formId: TForm['id'];
  formSchema: Record<string, TFormSchema>;
  onBoundingBoxFocus: (boundingBox: {
    keyBoundingBox: TBoundingBox,
    valueBoundingBox: TBoundingBox,
  }) => void;
  // setForm accepts `null` to match the type from FormEdit where the form state starts as null
  // while data is being fetched. In this component, setForm is safely used with non-null
  // assertions because the logic to update the form is only executed once the form is loaded.
  setForm: Dispatch<SetStateAction<TForm | null>>;
  setFormSchema: (newFormSchema: TTemplate['formSchema']) => void;
  templates: TTemplateOption[];
  userTabOverrideKey: TUserPrefs['tab']['overrideKey'];
}

export default function EditTab({
  form,
  formId,
  formSchema,
  onBoundingBoxFocus,
  setForm,
  setFormSchema,
  templates,
  userTabOverrideKey,
}: EditTabProps) {
  const [selectedTemplateId, setSelectedTemplate] = useState<TForm['templateId']>(form?.templateId || '')
  const [currentTemplate, setCurrentTemplate] = useState<TTemplate | null>(null)

  useEffect(() => {
    const fetchTemplate = async () => {
      if (form?.templateId) {
        try {
          const response = await axios.get(
            `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${form.templateId}`,
          )
          setCurrentTemplate(response.data)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error fetching template:', err)
          toast.error('Error fetching template data')
        }
      }
    }

    fetchTemplate()
  }, [form?.templateId])

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const keyBoundingBox = {
      Top: parseFloat(e.target.dataset.keyBboxTop || '0'),
      Left: parseFloat(e.target.dataset.keyBboxLeft || '0'),
      Width: parseFloat(e.target.dataset.keyBboxWidth || '0'),
      Height: parseFloat(e.target.dataset.keyBboxHeight || '0'),
    }
    const valueBoundingBox = {
      Top: parseFloat(e.target.dataset.valueBboxTop || '0'),
      Left: parseFloat(e.target.dataset.valueBboxLeft || '0'),
      Width: parseFloat(e.target.dataset.valueBboxWidth || '0'),
      Height: parseFloat(e.target.dataset.valueBboxHeight || '0'),
    }

    onBoundingBoxFocus({ keyBoundingBox, valueBoundingBox })
  }

  interface TMappedFormItems {
    [key: string]: TFormItem | string;
  }

  const mapDetectedToDeclared = (
    newFormSchema: TTemplate['formSchema'],
    formItems: TMappedFormItems,
  ) => {
    const formSchemaKeys = Object.keys(newFormSchema)
    const newFormDeclared = formSchemaKeys.reduce((acc, key) => {
      if (key in formItems) {
        acc[key] = formItems[key]
      } else {
        acc[key] = ''
      }
      return acc
    }, {} as TMappedFormItems)

    return newFormDeclared
  }

  const handleApply = async () => {
    // TODO: refactor to inline warning, ie non-toast.
    if (!selectedTemplateId || selectedTemplateId.trim().length < 1) {
      toast.warning('No template selected.')
      return
    }

    try {
      const setTemplateIdUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setTemplateIdUrl, { updates: { templateId: selectedTemplateId } })

      const getTemplateDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${selectedTemplateId}`
      const response = await axios.get(getTemplateDataUrl)
      const newFormSchema = response.data.formSchema

      setFormSchema(newFormSchema)
      setForm((prevForm): TForm => {
        // Non-null assertion is safe here because handleApply is only called after form is loaded.
        const nonNullPrevForm = prevForm!

        // Since handleApply is user-initiated, map formDetected to formDeclared, overwriting values
        const mappedFormDeclared = mapDetectedToDeclared(
          newFormSchema,
          nonNullPrevForm.formDetected!,
        )

        return {
          ...nonNullPrevForm,
          formDeclared: mappedFormDeclared as Record<string, TFormItem>,
          templateId: selectedTemplateId,
        }
      })
      // toast.success('Template updated successfully.')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating template:', err)
      toast.error('Error updating template.')
    }
  }

  const handleChangeTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value)
  }

  const handleChangeFormData = (key: string, value: string) => {
    setForm((prevForm): TForm => {
      // Non-null assertion is safe here because handleChangeFormData is only called after form is
      // loaded.
      const nonNullPrevForm = prevForm!

      const updatedFormDeclared = {
        ...nonNullPrevForm.formDeclared,
        [key]: {
          ...nonNullPrevForm.formDeclared?.[key],
          value,
        },
      }

      return {
        ...nonNullPrevForm,
        formDeclared: updatedFormDeclared as Record<string, TFormItem>,
      }
    })
  }

  const handleSave = async () => {
    try {
      const setFormDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setFormDataUrl, { updates: { formDeclared: form.formDeclared } })
      toast.success('Form saved!')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving form data:', err)
      toast.error('Error saving form data.')
    }
  }

  const templateRows = (
    <>
      <label htmlFor='template-select' className='mb-2 block font-semibold text-gray-700'>
        Template
      </label>
      <select
        className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
        id='template-select'
        onChange={handleChangeTemplate}
        value={selectedTemplateId}
      >
        <option value='' disabled>
          Select Template
        </option>
        {templates.map((option) => (
          <option key={option.key} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </>
  )

  const renderOrderedFields = () => {
    if (!currentTemplate) {
      return <div>Loading template...</div>
    }

    const unorderedFields = new Set<string>()

    const sortedKeys = Object.keys(formSchema)
      .sort((a, b) => {
        const orderA = currentTemplate.formSchemaOrder.indexOf(a)
        const orderB = currentTemplate.formSchemaOrder.indexOf(b)

        // Collect unordered fields
        if (orderA === -1) unorderedFields.add(a)
        if (orderB === -1) unorderedFields.add(b)

        // If both are not in order, sort alphabetically
        if (orderA === -1 && orderB === -1) {
          return a.localeCompare(b)
        }

        // If only one is not in order, put it at the end
        if (orderA === -1) return 1
        if (orderB === -1) return -1

        // Normal case: both are in order
        return orderA - orderB
      })

    // Log unordered fields once
    if (unorderedFields.size > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `Template ${currentTemplate.id} has form data not present in formSchemaOrder. Placing at end, not necessarily in this order:`,
        Array.from(unorderedFields),
      )
    }

    return sortedKeys.map((key) => {
      const value = formSchema[key]
      const itemDeclared = form?.formDeclared?.[key]
      const itemDetected = form?.formDetected?.[key]

      const keyBoundingBox = itemDeclared?.keyBoundingBox
      const valueBoundingBox = itemDeclared?.valueBoundingBox
      const valueDeclared = itemDeclared?.value ?? ''
      const valueDetected = itemDetected?.value ?? ''

      return (
        <div key={key} className='mb-4'>
          <label htmlFor={key} className='block'>
            <span className='text-sm font-semibold'>{key}</span>
            <input
              className={mergeClassName(
                'mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-gray-700',
                (valueDetected !== valueDeclared) && (
                  userTabOverrideColors[userTabOverrideKey].className
                ),
              )}
              id={key}
              name={key}
              onFocus={handleInputFocus}
              onChange={(e) => handleChangeFormData(key, e.target.value)}
              required={value?.required}
              type={value?.type === 'string' ? 'text' : value?.type}
              value={valueDeclared}
              data-key-bbox-top={keyBoundingBox?.Top}
              data-key-bbox-left={keyBoundingBox?.Left}
              data-key-bbox-width={keyBoundingBox?.Width}
              data-key-bbox-height={keyBoundingBox?.Height}
              data-value-bbox-top={valueBoundingBox?.Top}
              data-value-bbox-left={valueBoundingBox?.Left}
              data-value-bbox-width={valueBoundingBox?.Width}
              data-value-bbox-height={valueBoundingBox?.Height}
            />
          </label>
        </div>
      )
    })
  }

  const formRowsOrdered = formSchema && currentTemplate
    ? renderOrderedFields()
    : <div>Please select and apply a template from above.</div>

  return (
    <div data-tab='edit'>
      <form>
        <Divider>
          <Heading as='h6' uppercase>Form Type</Heading>
        </Divider>

        <div className='mb-4'>
          { templateRows }
        </div>

        <div className='mb-4 space-x-1'>
          <Button onClick={handleApply} primary ariaLabel='Apply changes'>Apply</Button>
          <Button onClick={handleSave} ariaLabel='Save changes'>Save</Button>
        </div>

        <Divider>
          <Heading as='h6' uppercase>Form Data</Heading>
        </Divider>

        <div className='space-y-4'>
          { formRowsOrdered }
        </div>

      </form>
    </div>
  )
}
