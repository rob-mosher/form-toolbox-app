import { Button, Modal } from 'semantic-ui-react'
import type { Form } from '../types'

type ModalDeleteFormProps = {
  handleDelete: (formId: Form['id'] | null) => void;
  isModalDeleteOpen: boolean,
  selectedFormId: Form['id'] | null,
  setIsModalDeleteOpen: (newIsModalDeleteOpen: boolean) => void,
}

export default function ModalDeleteForm({
  handleDelete,
  isModalDeleteOpen,
  selectedFormId,
  setIsModalDeleteOpen,
}: ModalDeleteFormProps) {
  return (
    <Modal
      size='mini'
      open={isModalDeleteOpen}
      onClose={() => setIsModalDeleteOpen(false)}
    >
      <Modal.Header>Delete Form</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this form?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={() => handleDelete(selectedFormId)}>
          Yes
        </Button>
        <Button negative onClick={() => setIsModalDeleteOpen(false)}>
          No
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
