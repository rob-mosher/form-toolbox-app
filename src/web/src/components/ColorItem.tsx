import { MouseEventHandler } from 'react'
import { mergeClassName } from '../lib'

interface ColorItemProps {
  ariaLabel: string
  colorClassName: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

// TODO add visual feedback within the button for the chosen value
export default function ColorItem({ ariaLabel, colorClassName, onClick }: ColorItemProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={mergeClassName(
        'size-9 rounded-full border border-gray-300',
        colorClassName,
      )}
      onClick={onClick}
      type='button'
    />
  )
}
