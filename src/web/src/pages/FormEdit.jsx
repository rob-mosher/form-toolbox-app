import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Tab } from 'semantic-ui-react'
import Content from '../common/Content'

export default function FormEdit() {
  const [form, setForm] = useState(null)

  const { formId } = useParams()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`

  useEffect(() => {
    axios.get(url)
      .then((resp) => {
        setForm(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load form.', {
          autoClose: 5000,
        })
        console.error('Unable to load form:', error)
      })
  }, [url])

  if (!form) {
    return <Header as='h2'>Form Details Editor Loading...</Header>
  }

  const panes = [
    {
      menuItem: { key: 'header', icon: 'wpforms', content: 'Data' },
      render: () => <p />,
    },
    {
      menuItem: { key: 'info', icon: 'info', content: 'Info' },
      render: () => <p />,
    },
    {
      menuItem: { key: 'settings', icon: 'cogs', content: 'Settings' },
      render: () => <p />,
    },
  ]

  return (
    <div className='ui grid'>

      <Content />
      <div className='six wide column ftbx-fitted-max'>
        <code>
          <Tab panes={panes} />
          {JSON.stringify(form)}
        </code>
      </div>
    </div>
  )
}
