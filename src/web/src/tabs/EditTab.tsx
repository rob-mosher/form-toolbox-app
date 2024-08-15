// TODO complete typscript refactor

import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Form } from 'semantic-ui-react'
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

const versionsTempData = [
  {
    key: 1,
    value: 1,
    text: 'WIP',
  },
]

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

  const handleChangeFormType = (e, data) => {
    setSelectedFormType(data.value)
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

  return (
    <div className='ui bottom attached active tab segment' data-tab='edit'>
      <Form>
        <Divider>
          <Heading as='h6' uppercase>Form Type</Heading>
        </Divider>

        <Form.Select
          label='Type'
          options={formTypes}
          onChange={handleChangeFormType}
          placeholder='Select Type'
          value={selectedFormType}
        />
        <Form.Select label='Version' options={versionsTempData} placeholder='Select Version' />

        <Button primary onClick={handleApply}>Apply</Button>
        <Button onClick={handleSave}>Save</Button>

        <Divider>
          <Heading as='h6' uppercase>Form Data</Heading>
        </Divider>

        {schema ? (

          Object.entries(JSON.parse(schema)).map(([key, value]) => (
            <Form.Field key={key}>
              <label htmlFor='key'>
                {key}
                <input
                  className='ftbx-mono'
                  id='key'
                  name={key}
                  onChange={(e) => handleChangeFormData(key, e.target.value)}
                  required={value?.required}
                  type={
                    value?.type === 'string'
                      ? 'text'
                      : value?.type
                  }
                  value={form?.formData?.[key] || ''}
                />
              </label>
            </Form.Field>
          ))
        ) : (
          <span>Please select and apply a form type from above.</span>
        )}

      </Form>
    </div>
  )
}
