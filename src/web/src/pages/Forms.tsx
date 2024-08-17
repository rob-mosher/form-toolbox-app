import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, PencilSquare, Trash } from '../assets'
import Heading from '../components/Heading'
import ModalDeleteForm from '../modals/ModalDeleteForm'
import type { Form, FormsList } from '../types'

export default function Forms() {
  const [forms, setForms] = useState<FormsList[]>([])
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false)
  const [selectedFormId, setSelectedFormId] = useState<Form['id'] | null>(null)
  const navigate = useNavigate()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms`

  const loadForms = useCallback(() => {
    axios.get(url)
      .then((resp) => {
        setForms(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load forms.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
        console.error('Unable to load forms:', error)
      })
  }, [url])

  const handleDelete = (formId: Form['id'] | null) => {
    if (formId === null) {
      // eslint-disable-next-line no-console
      console.warn('Attempted to delete a form with a null ID. No action will be taken.')
      return
    }

    axios.delete(`${url}/${formId}`)
      .then(() => {
        toast.success('Form deleted successfully')
        setIsModalDeleteOpen(false)
        loadForms()
      })
      .catch((error) => {
        toast.error('Error: Unable to delete form.')
        // eslint-disable-next-line no-console
        console.error('Unable to delete form:', error)
      })
  }

  useEffect(() => {
    loadForms()
  }, [loadForms])

  return (
    <>
      <Heading as='h2'>Forms</Heading>
      <table className='divide-y divide-gray-300'>
        <thead>
          <tr>
            <th className='p-2 text-sm uppercase'>Action</th>
            <th className='p-2 text-sm uppercase'>Status</th>
            <th className='p-2 text-sm uppercase'>Pages</th>
            <th className='p-2 text-sm uppercase'>File Name</th>
            <th className='p-2 text-sm uppercase'>Type</th>
            <th className='p-2 text-sm uppercase'>Form ID</th>
            <th className='p-2 text-sm uppercase'>Textract Job ID</th>
            <th className='p-2 text-sm uppercase'>Uploaded At</th>
          </tr>
        </thead>

        <tbody className='bg-white'>
          {forms.map((form) => (
            <tr key={form.id} className='even:bg-gray-100'>
              <td className='p-3'>
                <span className='flex items-center justify-center gap-1'>
                  <button
                    aria-label='View Form'
                    onClick={() => navigate(`/forms/${form.id}`)}
                    type='button'
                  >
                    <Eye />
                  </button>
                  <button
                    aria-label='Edit form'
                    onClick={() => navigate(`/forms/${form.id}/edit`)}
                    type='button'
                  >
                    <PencilSquare />
                  </button>
                  <button
                    aria-label='Delete form'
                    onClick={() => {
                      setSelectedFormId(form.id)
                      setIsModalDeleteOpen(true)
                    }}
                    type='button'
                  >
                    <Trash />
                  </button>
                </span>
              </td>
              {/* TODO max-w-[xch] isn't working exactly as expected, but good enough for now */}
              <td className='p-3'>{form.status}</td>
              <td className='p-3 text-center'>{form.pageCount}</td>
              <td className='max-w-xs truncate p-3'>{form.fileName}</td>
              <td className='max-w-sm truncate p-3'>{form.template?.name}</td>
              <td className='max-w-[11ch] truncate p-3'>{form.id}</td>
              <td className='max-w-[11ch] truncate p-3'>{form.textractJobId}</td>
              <td className='p-3'>{new Date(form.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalDeleteForm
        handleDelete={handleDelete}
        isModalDeleteOpen={isModalDeleteOpen}
        selectedFormId={selectedFormId}
        setIsModalDeleteOpen={setIsModalDeleteOpen}
      />
    </>
  )
}
