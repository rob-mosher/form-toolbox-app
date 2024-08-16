import { ReactNode } from 'react'

interface ModalProps {
  ariaLabel: string
  ariaLabelBackdrop: string
  children: ReactNode
  onClickBackdrop?: () => void;
}

export default function Modal({
  ariaLabel, ariaLabelBackdrop, children, onClickBackdrop,
}:ModalProps) {
  return (
    // TODO resolve accessibility issues
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    <div
      aria-label={ariaLabelBackdrop}
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/25 backdrop-blur'
      onClick={onClickBackdrop}
      role='button'
    >
      <div
        aria-label={ariaLabel}
        className='w-full max-w-[500px] rounded-xl bg-white p-6 drop-shadow-xl'
      >
        {children}
      </div>
    </div>
  )
}
