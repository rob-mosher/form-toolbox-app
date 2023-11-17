import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Tab } from 'semantic-ui-react'
import Content from '../common/Content'
import EditTab from '../tabs/EditTab'
import InfoTab from '../tabs/InfoTab'

export default function FormEdit() {
  const [form, setForm] = useState(null)
  const [formTypes, setFormTypes] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [schema, setSchema] = useState(null)

  const { formId } = useParams()

  const formApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
  const formTypesApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes/`
  const imageApiUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}/image-urls`

  const formTypeApiUrl = form?.formTypeId
    ? `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes/${form?.formTypeId}`
    : null

  useEffect(() => {
    // Get formtypes
    axios.get(formTypesApiUrl)
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
    axios.get(imageApiUrl)
      .then((resp) => {
        setImageUrls(resp.data)
      })
      .catch((error) => {
        console.error('Error fetching presigned URLs:', error.message)
      })

    // Get form data
    axios.get(formApiUrl)
      .then((resp) => {
        setForm(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load form.', {
          autoClose: 5000,
        })
        console.error('Unable to load form:', error.message)
      })
  }, [])

  useEffect(() => {
    if (form?.formTypeId) {
      axios.get(formTypeApiUrl)
        .then((resp) => {
          console.log('schema found:', resp.data[0].schema)
          setSchema(resp.data[0].schema)
        })
        .catch((err) => {
          console.error('Error fetching schema:', err)
          toast.error('Error fetch form tyhpe schema.')
        })
    }
  }, [form?.formTypeId, formTypeApiUrl])

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
