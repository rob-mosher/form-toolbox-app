import { XMark } from '../assets'
import Button from '../components/Button'
import Heading from '../components/Heading'
import type { TForm } from '../types'

type ModalDeleteFormProps = {
  handleDelete: (formId: TForm['id'] | null) => void;
  hideModal: () => void,
  selectedFormId: TForm['id'] | null,
}

export default function ModalDeleteForm({
  handleDelete,
  hideModal,
  selectedFormId,
}: ModalDeleteFormProps) {
  return (
    <>
      <div className='mb-4 flex items-start justify-between'>
        <Heading as='h4'>
          Delete form?
        </Heading>
        <button
          aria-label='Close window'
          type='button'
          onClick={() => hideModal()}
        >
          <XMark />
        </button>
      </div>
      <p>
        Are you sure you want to delete this form? All of the data will be removed forever.
        This action cannot be undone.
      </p>
      <div className='mt-9 flex justify-end gap-2'>
        <Button ariaLabel='Cancel' onClick={() => hideModal()}>
          Cancel
        </Button>
        <Button ariaLabel='Delete' negative onClick={() => handleDelete(selectedFormId)}>
          Delete
        </Button>
      </div>
    </>
  )
}
