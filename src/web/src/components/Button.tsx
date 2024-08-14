import clsx from 'clsx'
import { ReactNode } from 'react'

interface ButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  id: string;
  primary?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  children = 'Button',
  disabled = false,
  id,
  primary = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      id={id}
      disabled={disabled}
      className={clsx(
        'rounded-lg px-7 py-3 font-semibold',
        primary ? 'bg-sky-600 text-white' : 'bg-stone-300 text-stone-700',
        disabled && 'opacity-60'
      )}
      // TODO resolve typescript issue
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {disabled}
      {children}
    </button>
  )
}

Button.defaultProps = {
  disabled: false,
  primary: false,
  type: 'button',
  children: '',
}
