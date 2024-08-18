import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean,
  children: ReactNode,
  onClose: () => void,
}

export default function Modal({
  isOpen, children, onClose,
}: ModalProps): ReactNode | null {
  return isOpen && (
    // TODO resolve accessibility issues
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    <div
      // aria-label={ariaLabelBackdrop}
      aria-label='TODO outer'
      className='fixed inset-0 z-[9998] flex items-center justify-center bg-gray-900/25 backdrop-blur'
      // onClick={onClose}
      onClick={() => {
        console.log('take action:', onClose)
      }}
      role='button'
    >
      <div
        // TODO fix onClickBackdrop from being clickable in within the actual modal
        // aria-label={ariaLabel}
        aria-label='TODO inner'
        className='z-[9999] w-full max-w-[500px] rounded-xl bg-white p-6 drop-shadow-xl'
      >
        {children}
      </div>
    </div>
  )
}
