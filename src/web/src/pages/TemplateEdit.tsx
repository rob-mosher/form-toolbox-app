import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InformationCircle, PencilSquare } from '../assets'
import Canvas from '../components/Canvas'
import Heading from '../components/Heading'
import Tab from '../components/Tab'
import { useGlobalState } from '../context/useGlobalState'
import { API_ENDPOINT, mergeClassName, userFormBgColors } from '../lib'
import EditTab from '../tabs/template/EditTab'
import InfoTab from '../tabs/template/InfoTab'
import type { TTab, TTemplate } from '../types'

type TemplateEditParams = {
  templateId: TTemplate['id']
}

export default function TemplateEdit() {
  const [activeTab, setActiveTab] = useState('edit')
  const [template, setTemplate] = useState<TTemplate | null>(null)
  const { userPrefs } = useGlobalState()
  const { templateId } = useParams<TemplateEditParams>()

  useEffect(() => {
    const templateApiUrl = `${API_ENDPOINT}/api/templates/${templateId}`

    // Get template data
    axios.get<TTemplate>(templateApiUrl)
      .then(async (resp) => {
        const fetchedTemplate = resp.data
        setTemplate(fetchedTemplate)
      })
      .catch((error) => {
        toast.error('Error: Unable to load template.', {
          autoClose: 5000,
        })
        // eslint-disable-next-line no-console
        console.error('Unable to load template:', error.message)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // templateId is not a dependency because it is used in the URL

  if (!template) {
    return <Heading as='h2'>Template Details Editor Loading...</Heading>
  }

  const tabs: TTab[] = [
    { id: 'edit', content: 'Edit', icon: <PencilSquare /> },
    { id: 'info', content: 'Info', icon: <InformationCircle /> },
  ]

  let tabCanvas
  switch (activeTab) {
    case 'edit':
      tabCanvas = <EditTab template={template} />
      break
    case 'info':
      tabCanvas = <InfoTab template={template} />
      break

    default:
      // eslint-disable-next-line no-console
      console.warn(`Invalid tab '${activeTab}'`)
      tabCanvas = (
        <div className='text-center text-red-700'>
          Invalid tab
        </div>
      )
  }

  return (
    <div className='flex h-full'>
      <div className='grid w-full grid-cols-12 gap-3'>
        <div className={mergeClassName(
          'col-span-9 overflow-y-scroll shadow-inner',
          userFormBgColors[userPrefs.form.bgKey].className,
        )}
        >
          <Canvas
            imageUrls={[]}
            userFormHighlightKey={userPrefs.form.highlightKey}
          />
        </div>
        <div className='col-span-3 mr-3 overflow-x-hidden overflow-y-scroll'>
          <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className='border border-gray-300 p-3.5'>
            {tabCanvas}
          </div>
        </div>
      </div>
    </div>
  )
}
