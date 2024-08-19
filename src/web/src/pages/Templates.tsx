import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, PencilSquare, Trash } from '../assets'
import Heading from '../components/Heading'
import { useGlobalState } from '../context'
import ModalDeleteTemplate from '../modals/ModalDeleteTemplate'
import type { TemplateType } from '../types'

export default function Templates() {
  const [templates, setTemplates] = useState<TemplateType[]>([])
  const { hideModal, showModal } = useGlobalState()
  const navigate = useNavigate()

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates`

  const loadTemplates = useCallback(() => {
    axios.get(url)
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
  }, [url])

  const handleDelete = (templateId: TemplateType['id'] | null) => {
    if (templateId === null) {
      // eslint-disable-next-line no-console
      console.warn('Attempted to delete a template with a null ID. No action will be taken.')
      return
    }

    axios.delete(`${url}/${templateId}`)
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
                    onClick={() => navigate(`/templates/${template.id}`)}
                    type='button'
                  >
                    <Eye />
                  </button>
                  <button
                    aria-label='Edit template'
                    onClick={() => navigate(`/templates/${template.id}/edit`)}
                    type='button'
                  >
                    <PencilSquare />
                  </button>
                  <button
                    aria-label='Delete template'
                    onClick={() => handleModalForDelete(template.id)}
                    type='button'
                  >
                    <Trash />
                  </button>
                </span>
              </td>
              <td className='p-3'>{template.name}</td>
              <td className='p-3 text-center'>{template.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
