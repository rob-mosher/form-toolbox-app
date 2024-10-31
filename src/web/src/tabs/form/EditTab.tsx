import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'
import axios from 'axios'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/Button'
import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import { mergeClassName, userTabOverrideColors } from '../../lib'
import type {
  TForm, TFormItem, TSchemaField, TTemplate, TTemplateOption, TUserPrefs,
} from '../../types'

type EditTabProps = {
  form: TForm;
  formId: TForm['id'];
  onBoundingBoxFocus: (boundingBox: {
    keyBoundingBox: TBoundingBox,
    valueBoundingBox: TBoundingBox,
  }) => void;
  schemaJSON: TTemplate['schemaJSON'] | null;
  // setForm accepts `null` to match the type from FormEdit where the form state starts as null
  // while data is being fetched. In this component, setForm is safely used with non-null
  // assertions because the logic to update the form is only executed once the form is loaded.
  setForm: Dispatch<SetStateAction<TForm | null>>;
  setSchemaJSON: (newSchemaJSON: TTemplate['schemaJSON']) => void;
  templates: TTemplateOption[];
  userTabOverrideKey: TUserPrefs['tab']['overrideKey'];
}

export default function EditTab({
  form,
  formId,
  onBoundingBoxFocus,
  schemaJSON,
  setForm,
  setSchemaJSON,
  templates,
  userTabOverrideKey,
}: EditTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TForm['templateId']>(form?.templateId || '')

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const keyBoundingBox = {
      Top: parseFloat(e.target.dataset.keyBboxTop || '0'),
      Left: parseFloat(e.target.dataset.keyBboxLeft || '0'),
      Width: parseFloat(e.target.dataset.keyBboxWidth || '0'),
      Height: parseFloat(e.target.dataset.keyBboxHeight || '0'),
    }
    const valueBoundingBox = {
      Top: parseFloat(e.target.dataset.valueBboxTop || '0'),
      Left: parseFloat(e.target.dataset.valueBboxLeft || '0'),
      Width: parseFloat(e.target.dataset.valueBboxWidth || '0'),
      Height: parseFloat(e.target.dataset.valueBboxHeight || '0'),
    }

    onBoundingBoxFocus({ keyBoundingBox, valueBoundingBox })
  }

  interface TMappedFormItems {
    [key: string]: TFormItem | string;
  }

  const mapDetectedToDeclared = (
    newSchemaJSON: TTemplate['schemaJSON'],
    formItems: TMappedFormItems,
  ) => {
    const schemaJSONKeys = Object.keys(JSON.parse(newSchemaJSON))
    const newFormDeclared = schemaJSONKeys.reduce((acc, key) => {
      if (key in formItems) {
        acc[key] = formItems[key]
      } else {
        acc[key] = ''
      }
      return acc
    }, {} as TMappedFormItems)

    return newFormDeclared
  }

  const handleApply = async () => {
    // TODO: refactor to inline warning, ie non-toast.
    if (!selectedTemplate || selectedTemplate.trim().length < 1) {
      toast.warning('No template selected.')
      return
    }

    try {
      const setTemplateIdUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setTemplateIdUrl, { updates: { templateId: selectedTemplate } })

      const getTemplateDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/templates/${selectedTemplate}`
      const response = await axios.get(getTemplateDataUrl)
      const newSchemaJSON = response.data[0].schemaJSON

      setSchemaJSON(newSchemaJSON)
      setForm((prevForm): TForm => {
        // Non-null assertion is safe here because handleApply is only called after form is loaded.
        const nonNullPrevForm = prevForm!

        // Since handleApply is user-initiated, map formDetected to formDeclared, overwriting values
        const mappedFormDeclared = mapDetectedToDeclared(
          newSchemaJSON,
          nonNullPrevForm.formDetected!,
        )

        return {
          ...nonNullPrevForm,
          formDeclared: mappedFormDeclared as Record<string, TFormItem>,
          templateId: selectedTemplate,
        }
      })
      // toast.success('Template updated successfully.')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating template:', err)
      toast.error('Error updating template.')
    }
  }

  const handleChangeTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value)
  }

  const handleChangeFormData = (key: string, value: string) => {
    setForm((prevForm): TForm => {
      // Non-null assertion is safe here because handleChangeFormData is only called after form is
      // loaded.
      const nonNullPrevForm = prevForm!

      const updatedFormDeclared = {
        ...nonNullPrevForm.formDeclared,
        [key]: {
          ...nonNullPrevForm.formDeclared?.[key],
          value,
        },
      }

      return {
        ...nonNullPrevForm,
        formDeclared: updatedFormDeclared as Record<string, TFormItem>,
      }
    })
  }

  const handleSave = async () => {
    try {
      const setFormDataUrl = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/${formId}`
      await axios.put(setFormDataUrl, { updates: { formDeclared: form.formDeclared } })
      toast.success('Form saved!')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving form data:', err)
      toast.error('Error saving form data.')
    }
  }

  const templateRows = (
    <>
      <label htmlFor='template-select' className='mb-2 block font-semibold text-gray-700'>
        Template
      </label>
      <select
        className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
        id='template-select'
        onChange={handleChangeTemplate}
        value={selectedTemplate}
      >
        <option value='' disabled>
          Select Template
        </option>
        {templates.map((option) => (
          <option key={option.key} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </>
  )

  const formRows = schemaJSON ? (
    Object.entries(JSON.parse(schemaJSON) as Record<string, TSchemaField>).map(([key, value]) => {
      const itemDeclared = form?.formDeclared?.[key]
      const itemDetected = form?.formDetected?.[key]

      const keyBoundingBox = itemDeclared?.keyBoundingBox
      const valueBoundingBox = itemDeclared?.valueBoundingBox
      const valueDeclared = itemDeclared?.value ?? ''
      const valueDetected = itemDetected?.value ?? ''

      return (
        <div key={key} className='mb-4'>
          <label htmlFor={key} className='block'>
            <span className='text-sm font-semibold'>{key}</span>
            <input
              className={mergeClassName(
                'mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-gray-700',
                (valueDetected !== valueDeclared) && (
                  userTabOverrideColors[userTabOverrideKey].className
                ),
              )}
              id={key}
              name={key}
              onFocus={handleInputFocus}
              onChange={(e) => handleChangeFormData(key, e.target.value)}
              required={value?.required}
              type={value?.type === 'string' ? 'text' : value?.type}
              value={valueDeclared}
              data-key-bbox-top={keyBoundingBox?.Top}
              data-key-bbox-left={keyBoundingBox?.Left}
              data-key-bbox-width={keyBoundingBox?.Width}
              data-key-bbox-height={keyBoundingBox?.Height}
              data-value-bbox-top={valueBoundingBox?.Top}
              data-value-bbox-left={valueBoundingBox?.Left}
              data-value-bbox-width={valueBoundingBox?.Width}
              data-value-bbox-height={valueBoundingBox?.Height}
            />
          </label>
        </div>
      )
    })
  ) : (
    <div>Please select and apply a template from above.</div>
  )

  return (
    <div data-tab='edit'>
      <form>
        <Divider>
          <Heading as='h6' uppercase>Form Type</Heading>
        </Divider>

        <div className='mb-4'>
          { templateRows }
        </div>

        <div className='mb-4 space-x-1'>
          <Button onClick={handleApply} primary ariaLabel='Apply changes'>Apply</Button>
          <Button onClick={handleSave} ariaLabel='Save changes'>Save</Button>
        </div>

        <Divider>
          <Heading as='h6' uppercase>Form Data</Heading>
        </Divider>

        <div className='space-y-4'>
          { formRows }
        </div>

      </form>
    </div>
  )
}
