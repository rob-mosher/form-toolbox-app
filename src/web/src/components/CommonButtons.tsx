import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { useGlobalState } from '../context/useGlobalState'
import ModalUploadForm from '../modals/ModalUploadForm'

export interface TCommonButtonProps {
  text?: string
  variant: 'newForm' | 'newTemplate'
}

export default function CommonButtons({ text = '', variant }: TCommonButtonProps) {
  const { hideModal, showModal } = useGlobalState()
  const navigate = useNavigate()

  const textNormalized = text.trim()

  const buttons = {
    newForm: (
      <Button
        ariaLabel='New Form'
        primary
        onClick={() => {
          showModal(<ModalUploadForm hideModal={hideModal} />)
        }}
      >
        {textNormalized.length > 0 ? textNormalized : 'New Form'}
      </Button>
    ),
    newTemplate: (
      <Button ariaLabel='New Template' primary onClick={() => navigate('/')}>
        {textNormalized.length > 0 ? textNormalized : 'New Template'}
      </Button>
    ),
  }

  return buttons[variant] || null
}
