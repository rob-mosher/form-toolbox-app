import FormDetails from '../common/FormDetails'

export default function InfoTab({ form }) {
  return (
    <div className='ui bottom attached active tab segment' data-tab='info'>
      <code>
        <FormDetails form={form} />
      </code>
    </div>
  )
}
