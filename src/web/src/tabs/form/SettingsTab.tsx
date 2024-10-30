import ColorItem from '../../components/ColorItem'
import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import { formUserBgColors, formUserHighlightColors, tabUserOverrideColors } from '../../lib'
import type { TFormUserBgKey, TFormUserHighlightKey, TTabUserOverrideKey } from '../../types'

type SettingsTabProps = {
  // formUserBgKey: TFormUserBgKey
  // formUserHighlightKey: TFormUserHighlightKey
  updateFormUserBgKey: (newBgKey: TFormUserBgKey) => void
  updateFormUserHighlightKey: (newHighlightKey: TFormUserHighlightKey) => void
  updateTabUserOverrideKey: (newOverrideKey: TTabUserOverrideKey) => void
}

export default function SettingsTab({
  // formUserBgKey,
  // formUserHighlightKey,
  updateFormUserBgKey,
  updateFormUserHighlightKey,
  updateTabUserOverrideKey,
}: SettingsTabProps) {
  const bgColorKeys = Object.keys(formUserBgColors)
  const bgColorChooser = bgColorKeys.map((bgColorKey) => (
    <ColorItem
      ariaLabel='Set form background color'
      colorClassName={formUserBgColors[bgColorKey].preview}
      key={bgColorKey}
      onClick={() => updateFormUserBgKey(bgColorKey)}
    />
  ))

  const highlightColorKeys = Object.keys(formUserHighlightColors)
  const highlightColorChooser = highlightColorKeys.map((highlightColorKey) => (
    <ColorItem
      ariaLabel='Set form highlight color'
      colorClassName={formUserHighlightColors[highlightColorKey].preview}
      key={highlightColorKey}
      onClick={() => updateFormUserHighlightKey(highlightColorKey)}
    />
  ))

  const tabUserOverrideColorKeys = Object.keys(tabUserOverrideColors)
  const tabUserOverrideColorChooser = tabUserOverrideColorKeys.map((overrideColorKey) => (
    <ColorItem
      ariaLabel='Set value difference color'
      colorClassName={tabUserOverrideColors[overrideColorKey].preview}
      key={overrideColorKey}
      onClick={() => updateTabUserOverrideKey(overrideColorKey)}
    />
  ))

  return (
    <div data-tab='settings'>
      <Divider>
        <Heading as='h6' uppercase>Form Options</Heading>
      </Divider>

      <fieldset className='mb-4'>
        <legend className='mb-2 block font-semibold text-gray-700'>
          Form Background Color
        </legend>
        <div id='bg-color-chooser' className='flex gap-1'>
          {bgColorChooser}
        </div>
      </fieldset>

      <fieldset className='mb-4'>
        <legend className='mb-2 block font-semibold text-gray-700'>
          Form Highlight Color
        </legend>
        <div id='highlight-color-chooser' className='flex gap-1'>
          {highlightColorChooser}
        </div>
      </fieldset>

      <fieldset>
        <legend className='mb-2 block font-semibold text-gray-700'>
          Tab Value Override Color
        </legend>
        <div id='value-difference-color-chooser' className='flex gap-1'>
          {tabUserOverrideColorChooser}
        </div>
      </fieldset>
    </div>
  )
}
