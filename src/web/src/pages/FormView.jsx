import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Header, List, Segment
} from 'semantic-ui-react'

export default function FormView() {
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
    return <Header as='h2'>Form Details Loading...</Header>
  }

  return (
    <>
      <Header as='h2'>Form Details</Header>
      <Segment>
        <List>
          <List.Item>
            <List.Content>
              <List.Header>File Name</List.Header>
              <code>
                {form.fileName}
              </code>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Status</List.Header>
              <code>
                {form.status}
              </code>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Uploaded At</List.Header>
              <code>
                {new Date(form.createdAt).toLocaleString()}
              </code>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Form ID</List.Header>
              <code>
                {form.id}
              </code>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Textract Job ID</List.Header>
              <code>
                {form.textractJobId}
              </code>
            </List.Content>
          </List.Item>
        </List>
      </Segment>
    </>
  )
}
