import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, PencilSquare, Trash } from '../assets'
import Heading from '../components/Heading'
import ModalDeleteFormType from '../modals/ModalDeleteFormType'
import type { FormType } from '../types'

export default function FormTypes() {
  const [formTypes, setFormTypes] = useState<FormType[]>([])
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false)
  const [selectedFormTypeId, setSelectedFormTypeId] = useState<FormType['id'] | null>(null)
  const navigate = useNavigate()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/formtypes`

  const loadFormTypes = useCallback(() => {
    axios.get(url)
      .then((resp) => {
        setFormTypes(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load forms.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
        console.error('Unable to load forms:', error)
      })
  }, [url])

  const handleDelete = (formTypeId: FormType['id'] | null) => {
    if (formTypeId === null) {
      // eslint-disable-next-line no-console
      console.warn('Attempted to delete a form with a null ID. No action will be taken.')
      return
    }

    axios.delete(`${url}/${formTypeId}`)
      .then(() => {
        toast.success('Form type deleted successfully')
        setIsModalDeleteOpen(false)
        loadFormTypes()
      })
      .catch((error) => {
        toast.error('Error: Unable to delete formType.')
        // eslint-disable-next-line no-console
        console.error('Unable to delete formType:', error)
      })
  }

  useEffect(() => {
    loadFormTypes()
  }, [loadFormTypes])

  return (
    <>
      <Heading as='h2'>Form Types</Heading>
      <table className='divide-y divide-gray-300'>
        <thead>
          <tr>
            <th className='p-2 text-sm uppercase'>Action</th>
            <th className='p-2 text-sm uppercase'>Name</th>
            <th className='p-2 text-sm uppercase'>ID</th>
          </tr>
        </thead>

        <tbody className='bg-white'>
          {formTypes.map((formType) => (
            <tr key={formType.id} className='even:bg-gray-100'>
              <td className='p-3'>
                <span className='flex items-center justify-center gap-1'>
                  <button
                    aria-label='View Form Type'
                    onClick={() => navigate(`/formtypes/${formType.id}`)}
                    type='button'
                  >
                    <Eye />
                  </button>
                  <button
                    aria-label='Edit form'
                    onClick={() => navigate(`/formtypes/${formType.id}/edit`)}
                    type='button'
                  >
                    <PencilSquare />
                  </button>
                  <button
                    aria-label='Delete form'
                    onClick={() => {
                      setSelectedFormTypeId(formType.id)
                      setIsModalDeleteOpen(true)
                    }}
                    type='button'
                  >
                    <Trash />
                  </button>
                </span>
              </td>
              {/* TODO max-w-[xch] isn't working exactly as expected, but good enough for now */}
              <td className='p-3'>{formType.name}</td>
              <td className='p-3 text-center'>{formType.id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalDeleteFormType
        handleDelete={handleDelete}
        isModalDeleteOpen={isModalDeleteOpen}
        selectedFormTypeId={selectedFormTypeId}
        setIsModalDeleteOpen={setIsModalDeleteOpen}
      />
    </>
  )
}
