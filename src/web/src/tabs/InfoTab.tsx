import FormDetails from '../components/FormDetails'
import type { Form } from '../types'

type InfoTabProps = {
  form: Form
}

export default function InfoTab({ form }: InfoTabProps) {
  return (
    <div className='overflow-hidden' data-tab='info'>
      <FormDetails form={form} />
    </div>
  )
}
