/**
 * Defines the structure for a style picker option
 * @property className - The Tailwind classes to apply to the element
 * @property preview - The Tailwind classes to show in the preview/selector
 */
type TStyleOption = {
  className: string;
  preview: string;
}

// TODO ensure display order is shown in a reliable way (ie via equivalent array)

export const userFormBgColors: Record<string, TStyleOption> = {
  white: {
    className: 'bg-white',
    preview: 'bg-white border border-gray-300 shadow-inner',
  },
  lightGray: {
    className: 'bg-gray-200',
    preview: 'bg-gray-200 border border-gray-300 shadow-inner',
  },
  mediumGray: {
    className: 'bg-gray-400',
    preview: 'bg-gray-400 border border-gray-400 shadow-inner', // bg and border are intentionally the same as it is a neutral color
  },
  darkGray: {
    className: 'bg-gray-700',
    preview: 'bg-gray-700 border border-gray-500 shadow-inner',
  },
  black: {
    className: 'bg-black',
    preview: 'bg-black border border-gray-500 shadow-inner',
  },
}

export const userFormHighlightColors: Record<string, TStyleOption> = {
  yellow: {
    className: 'stroke-2 stroke-yellow-400/40 fill-yellow-400/30',
    preview: 'bg-yellow-300 border border-yellow-400 shadow-inner',
  },
  fuchsia: {
    className: 'stroke-2 stroke-fuchsia-400/40 fill-fuchsia-400/30',
    preview: 'bg-fuchsia-400 border border-fuchsia-400 shadow-inner',
  },
  green: {
    className: 'stroke-2 stroke-green-400/40 fill-green-400/30',
    preview: 'bg-green-400 border border-green-500 shadow-inner',
  },
}

export const userTabOverrideColors: Record<string, TStyleOption> = {
  yellow: {
    className: 'bg-yellow-400/30',
    preview: 'bg-yellow-300 border border-yellow-400 shadow-inner',
  },
  fuchsia: {
    className: 'bg-fuchsia-400/30',
    preview: 'bg-fuchsia-400 border border-fuchsia-400 shadow-inner',
  },
  green: {
    className: 'bg-green-400/30',
    preview: 'bg-green-400 border border-green-500 shadow-inner',
  },
  none: {
    className: '', // Intentionally left blank
    preview: 'bg-white relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(-45deg,transparent_45%,red_45%,red_55%,transparent_55%)] border border-gray-300 shadow-inner rounded-full',
  },
}
