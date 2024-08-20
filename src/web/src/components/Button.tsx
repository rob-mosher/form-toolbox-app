import React, { ReactNode } from 'react'
import { mergeClassName } from '../lib'

interface ButtonProps {
  ariaLabel: string;
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  negative?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown;
  positive?: boolean
  primary?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  ariaLabel,
  children = 'Button',
  disabled = false,
  id,
  negative = false,
  onClick,
  positive = false,
  primary = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={mergeClassName(
        'rounded px-6 py-2 font-semibold disabled:opacity-60',
        primary ? 'bg-sky-600 text-white' : 'ring-1 ring-inset ring-gray-300 text-stone-900',
        primary && (!disabled ? 'hover:bg-sky-500' : 'hover:bg-stone-100'),
        positive && 'bg-green-600 text-white',
        positive && !disabled && 'hover:bg-green-500',
        negative && 'bg-red-600 text-white',
        negative && !disabled && 'hover:bg-red-500',
        disabled && 'cursor-grab',
      )}
      disabled={disabled}
      id={id}
      onClick={onClick}
      // ESLint rule disabled: TS and default value enforce valid 'button' or 'submit' values
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {children}
    </button>
  )
}
