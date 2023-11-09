import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Icon, Table } from 'semantic-ui-react'

export default function Forms() {
  const [forms, setForms] = useState([])

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms`

  useEffect(() => {
    axios.get(url)
      .then((resp) => {
        setForms(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load forms.', {
          autoClose: 5000,
        })
        console.error('Unable to load forms:', error)
      })
  }, [url])

  return (
    <>
      <Header as='h2'>Forms</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Action</Table.HeaderCell>
            <Table.HeaderCell>File Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Uploaded At</Table.HeaderCell>
            <Table.HeaderCell>Form ID</Table.HeaderCell>
            <Table.HeaderCell>Textract Job ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {forms.map((form) => (
            <Table.Row key={form.id}>
              <Table.Cell>
                <Link to={`/forms/${form.id}`}>
                  <Icon name='eye' />
                </Link>
              </Table.Cell>
              {' '}
              <Table.Cell>{form.fileName}</Table.Cell>
              <Table.Cell>{form.status}</Table.Cell>
              <Table.Cell>{new Date(form.createdAt).toLocaleString()}</Table.Cell>
              <Table.Cell>{form.id}</Table.Cell>
              <Table.Cell>{form.textractJobId}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
