// TODO complete typscript refactor

import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import Divider from '../components/Divider'
import Heading from '../components/Heading'
import type { Form, Schema, TemplateOption } from '../types'

type EditTabProps = {
  form: Form;
  formId: Form['id'];
  schema: Schema | null;
  setForm: (newForm: Form) => void;
  setSchema: (newSchema: Schema) => void;
  templates: TemplateOption[];
}

export default function EditTab({
  form,
  formId,
  schema,
  setForm,
  setSchema,
  templates,
}: EditTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(form.templateId || '')

  const mapTextractKeyValuesToFormData = (newSchema, textractKeyValues) => {
    const schemaKeys = Object.keys(JSON.parse(newSchema))
    const newFormData = schemaKeys.reduce((acc, key) => {
      if (key in textractKeyValues) {
        acc[key] = textractKeyValues[key]
      } else {
        acc[key] = ''
      }
      return acc
    }, {})

    return newFormData
  }

  const handleApply = async () => {
    try {
      // Set templateId on the form.
      const setTemplateIdUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setTemplateIdUrl, { updates: { templateId: selectedTemplate } })

      // Get the new schema.
      const getTemplateDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${selectedTemplate}`
      const response = await axios.get(getTemplateDataUrl)
      const newSchema = response.data[0].schema

      // Update state with the above changes.
      setSchema(newSchema)
      setForm((prevForm) => {
        // Since handleApply is user-initiated, map textractKeyValues to formData, replacing values
        const mappedFormData = mapTextractKeyValuesToFormData(newSchema, prevForm.textractKeyValues)
        return {
          ...prevForm,
          formTemplateId: selectedTemplate,
          formData: mappedFormData,
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

  const handleChangeFormData = ((key: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      formData: {
        ...prevForm.formData,
        [key]: value,
      },
    }))
  })

  const handleSave = async () => {
    try {
      const setFormDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setFormDataUrl, { updates: { formData: form.formData } })
      toast.success('Form saved!')
    } catch (err) {
      console.error('Error saving form data:', err)
      toast.error('Error saving form data.')
    }
  }

  const formRows = schema ? (
    Object.entries(JSON.parse(schema)).map(([key, value]) => (
      <div key={key}>
        <label htmlFor={key}>
          <span className='text-sm font-semibold'>{key}</span>
          <input
            className='mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-gray-700'
            id={key}
            name={key}
            onChange={(e) => handleChangeFormData(key, e.target.value)}
            required={value?.required}
            type={value?.type === 'string' ? 'text' : value?.type}
            value={form?.formData?.[key] || ''}
          />
        </label>
      </div>
    ))
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
        </div>

        <div className='mb-4 space-x-1'>
          <Button onClick={handleApply} primary ariaLabel='Apply changes'>Apply</Button>
          <Button onClick={handleSave} ariaLabel='Save changes'>Save</Button>
        </div>

        <Divider>
          <Heading as='h6' uppercase>Form Data</Heading>
        </Divider>

        <div className='space-y-4'>{ formRows }</div>

      </form>
    </div>
  )
}
