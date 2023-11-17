import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react'
import {
  Button, Divider, Form, Header
} from 'semantic-ui-react'

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
  setForm,
}) {
  const [selectedFormType, setSelectedFormType] = useState(form.formTypeId || '')

  const handleApply = async () => {
    try {
      const setFormTypeUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setFormTypeUrl, { updates: { formTypeId: selectedFormType } })
      setForm((prevForm) => ({
        ...prevForm,
        formTypeId: selectedFormType,
      }))
      toast.success('Form type updated successfully.')
    } catch (err) {
      console.error('Error updating form type:', err)
      toast.error('Error updating form type.')
    }
  }

  const handleChangeFormType = (e, data) => {
    console.log('handleChangeFormType called with', data.value)
    setSelectedFormType(data.value)
  }

  return (
    <div className='ui bottom attached active tab segment' data-tab='edit'>
      <Form>
        <Divider horizontal>
          <Header size='small' content='Form Type' className='ftbx-uppercase' />
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
        <Button>Detect</Button>

        <Divider horizontal>
          <Header size='small' content='Form Data' className='ftbx-uppercase' />
        </Divider>

        <Form.Field>
          <label htmlFor='formField1'>
            Field 1
            <input
              type='text'
              name='title'
              id='formField1'
              className='ftbx-mono'
              defaultValue='Example Data'
            />
          </label>
        </Form.Field>

        <Form.Field>
          <label htmlFor='formField1'>
            Field 2
            <input
              type='text'
              name='title'
              id='formField1'
              className='ftbx-mono'
              defaultValue='More example data'
            />
          </label>
        </Form.Field>

        <Form.Field>
          <label htmlFor='formField1'>
            Field 3
            <input
              type='text'
              name='title'
              id='formField1'
              className='ftbx-mono'
              defaultValue='Even more example data'
            />
          </label>
        </Form.Field>
      </Form>
    </div>
  )
}
