import FormDetails from '../common/FormDetails'

import type { Form } from '../types'

type InfoTabProps = {
  form: Form
}

export default function InfoTab({ form }: InfoTabProps) {
  return (
    <div className='ui bottom attached active tab segment' data-tab='info'>
      <code>
        <FormDetails form={form} />
      </code>
    </div>
  )
}
