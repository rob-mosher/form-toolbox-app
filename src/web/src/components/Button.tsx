import clsx from 'clsx'
import React, { ReactNode } from 'react'

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
      // TODO implement tw-merge and ordering for negative, positive, and primary
      className={clsx(
        'rounded px-7 py-3 font-semibold disabled:opacity-60',
        negative && 'bg-red-500 text-white',
        positive && 'bg-green-500 text-white',
        primary ? 'bg-sky-600 text-white' : 'bg-stone-300 text-stone-700',
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
