import React, { ReactNode } from 'react'
import { mergeClassName } from '../lib/utils'

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
        'rounded px-6 py-2 font-semibold hover:ring-2 hover:ring-inset disabled:opacity-60',
        primary ? 'bg-sky-600 text-white hover:ring-sky-900' : 'bg-stone-200 text-stone-600 hover:ring-stone-400',
        positive && 'bg-green-500 text-white hover:ring-green-700',
        negative && 'bg-red-500 text-white hover:ring-red-900',
      )}
      disabled={disabled}
      id={id}
      onClick={onClick}
      // TODO resolve typescript issue
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {children}
    </button>
  )
}
