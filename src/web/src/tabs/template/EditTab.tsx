import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import { sortFormSchemaKeysByOrder } from '../../lib'
import type { TTemplate } from '../../types'

type EditTabProps = {
  template: TTemplate;
}

export default function EditTab({
  template,
}: EditTabProps) {
  const renderOrderedFields = () => {
    if (!template) {
      return <div>Loading template...</div>
    }

    const { formSchema, formSchemaOrder } = template
    const sortedFormSchemaKeys = sortFormSchemaKeysByOrder(formSchema, formSchemaOrder)

    return sortedFormSchemaKeys.map((key) => (
      <div key={key} className='mb-4 flex flex-row justify-between'>
        <div className='text-sm font-semibold'>{key}</div>
        <div className='text-sm text-gray-500'>{formSchema[key].type}</div>
      </div>
    ))
  }

  return (
    <div data-tab='edit'>
      <form>
        <Divider>
          <Heading as='h6' uppercase>Form Schema</Heading>
        </Divider>
        <div className='space-y-4'>
          { renderOrderedFields() }
        </div>
      </form>
    </div>
  )
}
