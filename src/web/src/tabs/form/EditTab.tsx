import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/Button'
import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import type {
  TForm, TFormItem, TSchemaField, TTemplate, TTemplateOption,
} from '../../types'

type EditTabProps = {
  form: TForm;
  formId: TForm['id'];
  schemaJSON: TTemplate['schemaJSON'] | null;
  setForm: (newForm: TForm) => void;
  setSchemaJSON: (newSchemaJSON: TTemplate['schemaJSON']) => void;
  templates: TTemplateOption[];
  onBoundingBoxFocus: (boundingBox: {
    keyBoundingBox: TBoundingBox,
    valueBoundingBox: TBoundingBox,
  }) => void;
}

export default function EditTab({
  form,
  formId,
  schemaJSON,
  setForm,
  setSchemaJSON,
  templates,
  onBoundingBoxFocus,
}: EditTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TForm['id']>(form?.templateId || '')

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
    newSchemaJSON: TTemplate['schemaJSON'],
    formItems: TMappedFormItems,
  ) => {
    const schemaJSONKeys = Object.keys(JSON.parse(newSchemaJSON))
    const newFormDeclared = schemaJSONKeys.reduce((acc, key) => {
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
    try {
      const setTemplateIdUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setTemplateIdUrl, { updates: { templateId: selectedTemplate } })

      const getTemplateDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${selectedTemplate}`
      const response = await axios.get(getTemplateDataUrl)
      const newSchemaJSON = response.data[0].schemaJSON

      setSchemaJSON(newSchemaJSON)
      setForm((prevForm) => {
        // Since handleApply is user-initiated, map formDetected to formDeclared, overwriting values
        const mappedFormDeclared = mapDetectedToDeclared(newSchemaJSON, prevForm.formDetected)

        return {
          ...prevForm,
          formTemplateId: selectedTemplate,
          formDeclared: mappedFormDeclared,
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
    setForm((prevForm) => {
      const updatedFormDeclared = {
        ...prevForm.formDeclared,
        [key]: {
          ...prevForm.formDeclared?.[key],
          value,
        },
      }

      return {
        ...prevForm,
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
        value={selectedTemplate}
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

  const formRows = schemaJSON ? (
    Object.entries(JSON.parse(schemaJSON) as Record<string, TSchemaField>).map(([key, value]) => {
      const formItem = form?.formDeclared?.[key]
      const inputValue = formItem?.value || ''
      const keyBoundingBox = formItem?.keyBoundingBox
      const valueBoundingBox = formItem?.valueBoundingBox

      return (
        <div key={key} className='mb-4'>
          <label htmlFor={key} className='block'>
            <span className='text-sm font-semibold'>{key}</span>
            <input
              className='mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-gray-700'
              id={key}
              name={key}
              onFocus={handleInputFocus}
              onChange={(e) => handleChangeFormData(key, e.target.value)}
              required={value?.required}
              type={value?.type === 'string' ? 'text' : value?.type}
              value={inputValue}
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
  ) : (
    <div>Please select and apply a template from above.</div>
  )

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
          { formRows }
        </div>

      </form>
    </div>
  )
}
