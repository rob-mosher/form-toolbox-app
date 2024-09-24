// TODO if uploading a form while on this page, reload the form list

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, PencilSquare, Trash } from '../assets'
import CommonButtons from '../components/CommonButtons'
import Heading from '../components/Heading'
import { useGlobalState } from '../context/useGlobalState'
import ModalDeleteForm from '../modals/ModalDeleteForm'
import type { TForm } from '../types'

type TFormsList = TForm & {
  template: {
    name: string;
  };
};

export default function FormList() {
  const [forms, setForms] = useState<TFormsList[]>([])
  const { hideModal, showModal } = useGlobalState()
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

  const handleDelete = (formId: TForm['id'] | null) => {
    if (formId === null) {
      // eslint-disable-next-line no-console
      console.warn('Attempted to delete a form with a null ID. No action will be taken.')
      return
    }

    axios.delete(`${url}/${formId}`)
      .then(() => {
        toast.success('Form deleted successfully')
        hideModal()
        loadForms()
      })
      .catch((error) => {
        toast.error('Error: Unable to delete form.')
        // eslint-disable-next-line no-console
        console.error('Unable to delete form:', error)
      })
  }

  const handleModalForDelete = (formId: string) => {
    const JSX = (
      <ModalDeleteForm
        handleDelete={handleDelete}
        selectedFormId={formId}
        hideModal={hideModal}
      />
    )

    showModal(JSX)
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
                    className='hover:text-sky-600'
                    onClick={() => navigate(`/forms/${form.id}`)}
                    type='button'
                  >
                    <Eye />
                  </button>
                  <button
                    aria-label='Edit form'
                    className={
                      form.status === 'ready'
                        ? 'hover:text-sky-600'
                        : 'cursor-default text-gray-300'
                    }
                    onClick={
                      form.status === 'ready'
                        ? () => navigate(`/forms/${form.id}/edit`)
                        : undefined
                    }
                    type='button'
                  >
                    <PencilSquare />
                  </button>
                  <button
                    aria-label='Delete form'
                    className='hover:text-red-500'
                    onClick={() => handleModalForDelete(form.id)}
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
              <td className='max-w-[11ch] truncate p-3 text-gray-500'>{form.id}</td>
              <td className='max-w-[11ch] truncate p-3 text-gray-500'>{form.textractJobId}</td>
              <td className='p-3 text-gray-500'>{new Date(form.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!forms || !Array.isArray(forms) || forms.length < 1) && (
        <div className='mb-6 flex size-full flex-col items-center justify-center gap-3 border border-gray-300 bg-gray-200 shadow-inner'>
          <Heading as='h2'>No Forms Found</Heading>
          <CommonButtons
            text='Upload New Form'
            variant='newForm'
          />
        </div>
      )}
    </>
  )
}
