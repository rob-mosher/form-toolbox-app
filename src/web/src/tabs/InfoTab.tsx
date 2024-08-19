import FormDetails from '../components/FormDetails'
import type { FormType } from '../types'

type InfoTabProps = {
  form: FormType
}

export default function InfoTab({ form }: InfoTabProps) {
  return (
    <div className='overflow-hidden' data-tab='info'>
      <FormDetails form={form} />
    </div>
  )
}
