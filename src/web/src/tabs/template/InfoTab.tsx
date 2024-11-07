import TemplateDetails from '../../components/TemplateDetails'
import type { TTemplate } from '../../types'

type InfoTabProps = {
  template: TTemplate
}

export default function InfoTab({ template }: InfoTabProps) {
  return (
    <div className='overflow-hidden' data-tab='info'>
      <TemplateDetails template={template} />
    </div>
  )
}
