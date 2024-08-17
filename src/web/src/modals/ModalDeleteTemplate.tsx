import { XMark } from '../assets'
import Button from '../components/Button'
import Heading from '../components/Heading'
import Modal from '../components/Modal'
import type { Template } from '../types'

type ModalDeleteFormProps = {
  handleDelete: (templateId: Template['id'] | null) => void;
  isModalDeleteOpen: boolean,
  selectedTemplateId: Template['id'] | null,
  setIsModalDeleteOpen: (newIsModalDeleteOpen: boolean) => void,
}

export default function ModalDeleteForm({
  handleDelete,
  isModalDeleteOpen,
  selectedTemplateId,
  setIsModalDeleteOpen,
}: ModalDeleteFormProps) {
  return (
    isModalDeleteOpen && (
      <Modal
        ariaLabel='Delete form?'
        ariaLabelBackdrop='Close delete form window'
        onClickBackdrop={() => setIsModalDeleteOpen(false)}
      >
        <div className='mb-4 flex items-start justify-between'>
          <Heading as='h4'>
            Delete form?
          </Heading>
          <button
            aria-label='Close window'
            type='button'
            onClick={() => setIsModalDeleteOpen(false)}
          >
            <XMark />
          </button>
        </div>
        <p>
          Are you sure you want to delete this form? All of the data will be removed forever.
          This action cannot be undone.
        </p>
        <div className='mt-9 flex justify-end gap-2'>
          <Button ariaLabel='Cancel' onClick={() => setIsModalDeleteOpen(false)}>
            Cancel
          </Button>
          <Button ariaLabel='Delete' negative onClick={() => handleDelete(selectedTemplateId)}>
            Delete
          </Button>
        </div>
      </Modal>
    )
  )
}
