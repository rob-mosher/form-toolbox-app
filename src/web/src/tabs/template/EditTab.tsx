import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import type { TTemplate } from '../../types'

type EditTabProps = {
  template: TTemplate;
}

export default function EditTab({
  template,
}: EditTabProps) {
  const renderOrderedFields = () => {
    const { formSchema, formSchemaOrder } = template

    if (!formSchema) {
      return <div>Loading form schema...</div>
    }

    const unorderedFields = new Set<string>()

    // TODO: Convert to shared function with form's EditTab
    const sortedKeys = Object.keys(formSchema)
      .sort((a, b) => {
        const orderA = formSchemaOrder.indexOf(a)
        const orderB = formSchemaOrder.indexOf(b)

        // Collect unordered fields
        if (orderA === -1) unorderedFields.add(a)
        if (orderB === -1) unorderedFields.add(b)

        // If both are not in order, sort alphabetically
        if (orderA === -1 && orderB === -1) {
          return a.localeCompare(b)
        }

        // If only one is not in order, put it at the end
        if (orderA === -1) return 1
        if (orderB === -1) return -1

        // Normal case: both are in order
        return orderA - orderB
      })

    // Log unordered fields once
    if (unorderedFields.size > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `Template ${template.id} has form data not present in formSchemaOrder. Placing at end, not necessarily in this order:`,
        Array.from(unorderedFields),
      )
    }

    return sortedKeys.map((key) => (
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
