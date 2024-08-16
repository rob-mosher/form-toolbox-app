import { ReactNode } from 'react'
import { mergeClassName } from '../lib/utils'

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode
  uppercase?: boolean
}

const headingStyles = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
}

export default function Heading({ as = 'h2', children, uppercase = false }: HeadingProps) {
  return (
    <div
      className={mergeClassName(
        'mb-3 font-bold tracking-tight',
        uppercase && 'uppercase',
        headingStyles[as],
      )}
    >
      {children}
    </div>

  )
}
