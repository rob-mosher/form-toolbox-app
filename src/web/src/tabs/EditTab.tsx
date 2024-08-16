// TODO complete typscript refactor

import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import Divider from '../components/Divider'
import Heading from '../components/Heading'
import type { Form as FormType, FormTypeOption, Schema } from '../types'

type EditTabProps = {
  form: FormType;
  formId: FormType['id'];
  formTypes: FormTypeOption[];
  schema: Schema | null;
  setForm: (newForm: FormType) => void;
  setSchema: (newSchema: Schema) => void;
}

export default function EditTab({
  form,
  formId,
  formTypes,
  schema,
  setForm,
  setSchema,
}: EditTabProps) {
  const [selectedFormType, setSelectedFormType] = useState(form.formTypeId || '')

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
      // Set formTypeId on the form.
      const setFormTypeIdUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setFormTypeIdUrl, { updates: { formTypeId: selectedFormType } })

      // Get the new schema.
      const getFormTypeDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes/${selectedFormType}`
      const response = await axios.get(getFormTypeDataUrl)
      const newSchema = response.data[0].schema

      // Update state with the above changes.
      setSchema(newSchema)
      setForm((prevForm) => {
        // Since handleApply is user-initiated, map textractKeyValues to formData, replacing values
        const mappedFormData = mapTextractKeyValuesToFormData(newSchema, prevForm.textractKeyValues)
        return {
          ...prevForm,
          formTypeId: selectedFormType,
          formData: mappedFormData,
        }
      })

      // toast.success('Form type updated successfully.')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating form type:', err)
      toast.error('Error updating form type.')
    }
  }

  const handleChangeFormType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormType(e.target.value)
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
            type={
            value?.type === 'string' ? 'text' : value?.type
          }
            value={form?.formData?.[key] || ''}
          />
        </label>
      </div>
    ))
  ) : (
    <div>Please select and apply a form type from above.</div>
  )

  return (
    <div data-tab='edit'>
      <form>
        <Divider>
          <Heading as='h6' uppercase>Form Type</Heading>
        </Divider>
        <div className='mb-4'>
          <label htmlFor='form-type-select' className='mb-2 block font-semibold text-gray-700'>
            Type
          </label>
          <select
            id='form-type-select'
            value={selectedFormType}
            onChange={handleChangeFormType}
            className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          >
            <option value='' disabled>
              Select Type
            </option>
            {formTypes.map((option) => (
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
