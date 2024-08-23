import FormDetails from '../../components/FormDetails'
import type { TForm } from '../../types'

type InfoTabProps = {
  form: TForm
}

export default function InfoTab({ form }: InfoTabProps) {
  return (
    <div className='overflow-hidden' data-tab='info'>
      <FormDetails form={form} />
    </div>
  )
}
