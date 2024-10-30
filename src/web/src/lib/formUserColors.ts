type TFormUserPrefs = {
  preview: string;
  className: string
}

// TODO ensure display order is shown in a reliable way (ie via equivalent array)

export const formUserBgColors: Record<string, TFormUserPrefs> = {
  white: {
    preview: 'bg-white border border-gray-300 shadow-inner',
    className: 'bg-white',
  },
  lightGray: {
    preview: 'bg-gray-200 border border-gray-300 shadow-inner',
    className: 'bg-gray-200',
  },
  mediumGray: {
    preview: 'bg-gray-400 border border-gray-200 shadow-inner',
    className: 'bg-gray-400',
  },
  darkGray: {
    preview: 'bg-gray-700 border border-gray-500 shadow-inner',
    className: 'bg-gray-700',
  },
  black: {
    preview: 'bg-black border border-gray-500 shadow-inner',
    className: 'bg-black',
  },
}

export const formUserHighlightColors: Record<string, TFormUserPrefs> = {
  yellow: {
    preview: 'bg-yellow-300 border border-yellow-400 shadow-inner',
    className: 'stroke-2 stroke-yellow-400/40 fill-yellow-400/30',
  },
  fuchsia: {
    preview: 'bg-fuchsia-400 border border-fuchsia-400 shadow-inner',
    className: 'stroke-2 stroke-fuchsia-400/40 fill-fuchsia-400/30',
  },
  green: {
    preview: 'bg-green-400 border border-green-500 shadow-inner',
    className: 'stroke-2 stroke-green-400/40 fill-green-400/30',
  },
}

export const tabUserOverrideColors: Record<string, TFormUserPrefs> = {
  yellow: {
    preview: 'bg-yellow-300 border border-yellow-400 shadow-inner',
    className: 'bg-yellow-400/30',
  },
  fuchsia: {
    preview: 'bg-fuchsia-400 border border-fuchsia-400 shadow-inner',
    className: 'bg-fuchsia-400/30',
  },
  green: {
    preview: 'bg-green-400 border border-green-500 shadow-inner',
    className: 'bg-green-400/30',
  },
  none: {
    preview: 'bg-white relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(-45deg,transparent_45%,red_45%,red_55%,transparent_55%)] border border-gray-300 shadow-inner rounded-full',
    className: '', // Intentionally left blank
  },
}
