import { Button, Modal } from 'semantic-ui-react'

export default function ModalDeleteForm({
  handleDelete,
  modalDeleteOpen,
  selectedFormId,
  setModalDeleteOpen,
}) {
  return (
    <Modal
      size='mini'
      open={modalDeleteOpen}
      onClose={() => setModalDeleteOpen(false)}
    >
      <Modal.Header>Delete Form</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this form?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={() => handleDelete(selectedFormId)}>
          Yes
        </Button>
        <Button negative onClick={() => setModalDeleteOpen(false)}>
          No
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
