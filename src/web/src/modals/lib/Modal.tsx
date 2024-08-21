/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

// The necessary event listeners (e.g., onClick, onKeyDown) have been added to non-interactive
// elements as part of the modal's custom behavior.

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

// Using tabindex to manage focus for accessibility within the modal structure, even though these
// elements are not natively interactive.

import {
  KeyboardEvent, ReactNode, useEffect, useRef,
} from 'react'

interface ModalProps {
  isOpen: boolean,
  children: ReactNode,
  onClose: () => void,
}

export default function Modal({
  isOpen, children, onClose,
}: ModalProps): ReactNode | null {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose()
  }

  return isOpen && (
    <section
      role='presentation'
      className='fixed inset-0 z-[9998] flex cursor-pointer items-center justify-center bg-gray-900/25 backdrop-blur'
      onClick={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Modal content'
        className='z-[9999] w-full max-w-[500px] cursor-auto rounded-xl bg-white p-6 drop-shadow-xl'
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from bubbling up
        onKeyDown={handleKeyDown} // Ensure keydown events are handled within the modal content
        tabIndex={0} // Make the modal content focusable
        ref={modalRef}
      >
        {children}
      </div>
    </section>
  )
}
