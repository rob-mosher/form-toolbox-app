import { MouseEventHandler } from 'react'
import { mergeClassName } from '../lib'

interface ColorItemProps {
  ariaLabel: string
  colorClassName: string
  isSelected: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

export default function ColorItem({
  ariaLabel,
  colorClassName,
  isSelected,
  onClick,
}: ColorItemProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={mergeClassName(
        'size-9 rounded-full border border-gray-300',
        colorClassName,
        isSelected && 'ring-2 ring-offset-1 ring-blue-500',
      )}
      onClick={onClick}
      type='button'
    />
  )
}
