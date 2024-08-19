import axios from 'axios'
import { ReactNode, useEffect, useState } from 'react'
import { XMark } from '../assets'
import Button from '../components/Button'
import Heading from '../components/Heading'
import type { TemplateType } from '../types'

type ModalDeleteTemplateProps = {
  handleDelete: (templateId: TemplateType['id'] | null) => void;
  hideModal: () => void,
  templateId: TemplateType['id'] | null,
}

export default function ModalDeleteTemplate({
  handleDelete,
  hideModal,
  templateId,
}: ModalDeleteTemplateProps) {
  const [canDeleteTemplate, setCanDeleteTemplate] = useState(false)
  const [prompt, setPrompt] = useState<ReactNode>((
    <p>
      Determining if template can be deleted.
    </p>
  ))

  const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates`

  useEffect(() => {
    const checkIfCanDelete = async () => {
      try {
        const response = await axios.get(`${url}/${templateId}/can-delete`)
        setCanDeleteTemplate(response.data.canDelete)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error checking if template can be deleted:', error)
        setCanDeleteTemplate(false) // Default to not allowing deletion if there's an error
      }
    }

    checkIfCanDelete()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const newPrompt = canDeleteTemplate ? (
      <p>
        Are you sure you want to delete this template? All of the data will be removed forever.
        This action cannot be undone.
      </p>
    ) : (
      <p>
        Cannot delete template, there are still form(s) that use it.
      </p>
    )

    setPrompt(newPrompt)
  }, [canDeleteTemplate])

  return (
    <>
      <div className='mb-4 flex items-start justify-between'>
        <Heading as='h4'>
          Delete template?
        </Heading>
        <button
          aria-label='Close window'
          type='button'
          onClick={() => hideModal()}
        >
          <XMark />
        </button>
      </div>
      {prompt}
      <div className='mt-9 flex justify-end gap-2'>
        <Button ariaLabel='Cancel' onClick={() => hideModal()}>
          Cancel
        </Button>
        <Button
          ariaLabel='Delete'
          disabled={!canDeleteTemplate}
          negative
          onClick={() => handleDelete(templateId)}
        >
          Delete
        </Button>
      </div>
    </>
  )
}
