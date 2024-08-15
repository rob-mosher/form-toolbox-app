import { ReactNode } from 'react'

interface DividerProps {
  children?: ReactNode
}

export default function Divider({ children }: DividerProps) {
  return (
    <div className=''>
      {children ? (
        <div className='flex gap-3'>
          <div className='my-4 h-px grow bg-stone-300' />
          <div className='shrink-0'>{children}</div>
          <div className='my-4 h-px grow bg-stone-300' />
        </div>
      ) : (
        <div className='my-4 h-px bg-stone-300' />
      )}
    </div>
  )
}
