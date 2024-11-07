import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, PencilSquare, Trash } from '../assets'
import Heading from '../components/Heading'
import { useGlobalState } from '../context'
import { API_ENDPOINT } from '../lib'
import ModalDeleteTemplate from '../modals/ModalDeleteTemplate'
import type { TTemplate } from '../types'

export default function TemplateList() {
  const [templates, setTemplates] = useState<TTemplate[]>([])
  const { hideModal, showModal } = useGlobalState()
  const navigate = useNavigate()

  const apiUrl = `${API_ENDPOINT}/api/templates`

  const loadTemplates = useCallback(() => {
    axios.get(apiUrl)
      .then((resp) => {
        setTemplates(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load templates.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
        console.error('Unable to load templates:', error)
      })
  }, [apiUrl])

  const handleDelete = (templateId: TTemplate['id'] | null) => {
    if (templateId === null) {
      // eslint-disable-next-line no-console
      console.warn('Attempted to delete a template with a null ID. No action will be taken.')
      return
    }

    axios.delete(`${apiUrl}/${templateId}`)
      .then(() => {
        toast.success('Template deleted successfully')
        hideModal()
        loadTemplates()
      })
      .catch((error) => {
        toast.error('Error: Unable to delete template.')
        // eslint-disable-next-line no-console
        console.error('Unable to delete template:', error)
      })
  }

  const handleModalForDelete = (templateId: string) => {
    const JSX = (
      <ModalDeleteTemplate
        handleDelete={handleDelete}
        templateId={templateId}
        hideModal={hideModal}
      />
    )

    showModal(JSX)
  }

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  return (
    <>
      <Heading as='h2'>Templates</Heading>
      <table className='divide-y divide-gray-300'>
        <thead>
          <tr>
            <th className='p-2 text-sm uppercase'>Action</th>
            <th className='p-2 text-sm uppercase'>Name</th>
            <th className='p-2 text-sm uppercase'>Fields</th>
            <th className='p-2 text-sm uppercase'>ID</th>
          </tr>
        </thead>

        <tbody className='bg-white'>
          {templates.map((template) => (
            <tr key={template.id} className='even:bg-gray-100'>
              <td className='p-3'>
                <span className='flex items-center justify-center gap-1'>
                  <button
                    aria-label='View template'
                    className='hover:text-sky-600'
                    onClick={() => navigate(`/templates/${template.id}`)}
                    type='button'
                  >
                    <Eye />
                  </button>
                  <button
                    aria-label='Edit template'
                    className='hover:text-sky-600'
                    onClick={() => navigate(`/templates/${template.id}/edit`)}
                    type='button'
                  >
                    <PencilSquare />
                  </button>
                  <button
                    aria-label='Delete template'
                    className='hover:text-red-500'
                    onClick={() => handleModalForDelete(template.id)}
                    type='button'
                  >
                    <Trash />
                  </button>
                </span>
              </td>
              <td className='p-3'>{template.name}</td>
              <td className='p-3 text-center'>{template.formSchemaCount}</td>
              <td className='p-3 text-center'>{template.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
