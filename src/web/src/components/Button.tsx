import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface ButtonProps {
  ariaLabel: string;
  children?: ReactNode;
  disabled?: boolean;
  id: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown;
  primary?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  ariaLabel,
  children = 'Button',
  disabled = false,
  id,
  primary = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx(
        'rounded-lg px-7 py-3 font-semibold disabled:opacity-60',
        primary ? 'bg-sky-600 text-white' : 'bg-stone-300 text-stone-700'
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
