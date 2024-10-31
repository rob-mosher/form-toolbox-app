import ColorItem from '../../components/ColorItem'
import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import { userFormBgColors, userFormHighlightColors, userTabOverrideColors } from '../../lib'
import type { TUserPrefs } from '../../types'

type SettingsTabProps = {
  updateUserFormBgKey: (newKey: TUserPrefs['form']['bgKey']) => void
  updateUserFormHighlightKey: (newKey: TUserPrefs['form']['highlightKey']) => void
  updateUserTabOverrideKey: (newKey: TUserPrefs['tab']['overrideKey']) => void
  userFormBgKey: TUserPrefs['form']['bgKey']
  userFormHighlightKey: TUserPrefs['form']['highlightKey']
  userTabOverrideKey: TUserPrefs['tab']['overrideKey']
}

export default function SettingsTab({
  updateUserFormBgKey,
  updateUserFormHighlightKey,
  updateUserTabOverrideKey,
  userFormBgKey,
  userFormHighlightKey,
  userTabOverrideKey,
}: SettingsTabProps) {
  const bgColorKeys = Object.keys(userFormBgColors)
  const bgColorChooser = bgColorKeys.map((bgColorKey) => (
    <ColorItem
      ariaLabel='Set form background color'
      colorClassName={userFormBgColors[bgColorKey].preview}
      isSelected={userFormBgKey === bgColorKey}
      key={bgColorKey}
      onClick={() => updateUserFormBgKey(bgColorKey)}
    />
  ))

  const highlightColorKeys = Object.keys(userFormHighlightColors)
  const highlightColorChooser = highlightColorKeys.map((highlightColorKey) => (
    <ColorItem
      ariaLabel='Set form highlight color'
      colorClassName={userFormHighlightColors[highlightColorKey].preview}
      isSelected={userFormHighlightKey === highlightColorKey}
      key={highlightColorKey}
      onClick={() => updateUserFormHighlightKey(highlightColorKey)}
    />
  ))

  const userTabOverrideColorKeys = Object.keys(userTabOverrideColors)
  const userTabOverrideColorChooser = userTabOverrideColorKeys.map((overrideColorKey) => (
    <ColorItem
      ariaLabel='Set value difference color'
      colorClassName={userTabOverrideColors[overrideColorKey].preview}
      isSelected={userTabOverrideKey === overrideColorKey}
      key={overrideColorKey}
      onClick={() => updateUserTabOverrideKey(overrideColorKey)}
    />
  ))

  return (
    <div data-tab='settings'>
      <Divider>
        <Heading as='h6' uppercase>Form</Heading>
      </Divider>

      <fieldset className='mb-4'>
        <legend className='mb-2 block font-semibold text-gray-700'>
          Background Color:
        </legend>
        <div id='bg-color-chooser' className='flex gap-1'>
          {bgColorChooser}
        </div>
      </fieldset>

      <fieldset className='mb-4'>
        <legend className='mb-2 block font-semibold text-gray-700'>
          Highlight Color:
        </legend>
        <div id='highlight-color-chooser' className='flex gap-1'>
          {highlightColorChooser}
        </div>
      </fieldset>

      <Divider>
        <Heading as='h6' uppercase>Edit Tab</Heading>
      </Divider>

      <fieldset>
        <legend className='mb-2 block font-semibold text-gray-700'>
          Override Color:
        </legend>
        <div id='value-difference-color-chooser' className='flex gap-1'>
          {userTabOverrideColorChooser}
        </div>
      </fieldset>
    </div>
  )
}
