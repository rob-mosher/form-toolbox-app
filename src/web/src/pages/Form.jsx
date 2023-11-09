import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Table } from 'semantic-ui-react'

export default function Form() {
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
    return <Header as='h2'>Loading...</Header>
  }

  return (
    <>
      <Header as='h2'>Form Details</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>File Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Uploaded At</Table.HeaderCell>
            <Table.HeaderCell>Form ID</Table.HeaderCell>
            <Table.HeaderCell>Textract Job ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>{form.fileName}</Table.Cell>
            <Table.Cell>{form.status}</Table.Cell>
            <Table.Cell>{new Date(form.createdAt).toLocaleString()}</Table.Cell>
            <Table.Cell>{form.id}</Table.Cell>
            <Table.Cell>{form.textractJobId}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  )
}
