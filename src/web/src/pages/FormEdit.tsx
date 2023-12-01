// TODO add check that form is ready for editing

import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Tab } from 'semantic-ui-react'

import Content from '../common/Content'
import EditTab from '../tabs/EditTab'
import InfoTab from '../tabs/InfoTab'

import type {
  Form, FormType, FormTypeOption, Schema
} from '../types'

type FormEditParams = {
  formId: Form['id']
}

export default function FormEdit() {
  const [form, setForm] = useState<Form | null>(null)
  const [formTypes, setFormTypes] = useState<FormTypeOption[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [schema, setSchema] = useState<Schema | null>(null)

  const { formId } = useParams<FormEditParams>()

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
        console.error('Error fetching formtypes:', error.message)
      })

    // Get form images/pages
    axios.get<string[]>(imageApiUrl)
      .then((resp) => {
        setImageUrls(resp.data)
      })
      .catch((error) => {
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
        console.error('Unable to load form:', error.message)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // formId is not a dependency because it is used in the URL

  if (!form) {
    return <Header as='h2'>Form Details Editor Loading...</Header>
  }

  const panes = [
    {
      menuItem: { key: 'edit', icon: 'edit', content: 'Edit' },
      render: () => (
        <EditTab
          form={form}
          formId={formId}
          formTypes={formTypes}
          schema={schema}
          setForm={setForm}
          setSchema={setSchema}
        />
      ),
    },
    {
      menuItem: { key: 'info', icon: 'info', content: 'Info' },
      render: () => <InfoTab form={form} />,
    },
    {
      menuItem: { key: 'settings', icon: 'cogs', content: 'Settings' },
      render: () => <p />,
    },
  ]

  return (
    <div className='ui grid'>

      <Content imageUrls={imageUrls} />
      <div className='six wide column ftbx-fitted-max'>
        <Tab panes={panes} />
      </div>
    </div>
  )
}
