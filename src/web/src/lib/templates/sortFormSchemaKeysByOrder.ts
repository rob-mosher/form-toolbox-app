/* eslint-disable import/prefer-default-export */
import type { TTemplate } from '../../types'

export const sortFormSchemaKeysByOrder = (
  formSchema: TTemplate['formSchema'],
  formSchemaOrder: TTemplate['formSchemaOrder'],
): string[] => {
  const unorderedKeys = new Set<string>()

  const sortedKeys = Object.keys(formSchema)
    .sort((a, b) => {
      const orderA = formSchemaOrder.indexOf(a)
      const orderB = formSchemaOrder.indexOf(b)

      // Collect unordered fields
      if (orderA === -1) unorderedKeys.add(a)
      if (orderB === -1) unorderedKeys.add(b)

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
  if (unorderedKeys.size > 0) {
  // eslint-disable-next-line no-console
    console.warn(
      `formSchema ${formSchema.id} has form data not present in formSchemaOrder. Placing at end, not necessarily in this order:`,
      Array.from(unorderedKeys),
    )
  }

  return sortedKeys
}
