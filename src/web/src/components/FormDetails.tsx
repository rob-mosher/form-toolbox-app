import type { Form } from '../types'

type FormDetailsProps = {
  form: Form;
}

export default function FormDetails({ form }: FormDetailsProps) {
  return (
    <code>
      {Object.entries(form).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '1em' }}>
          <div>
            <strong>
              {key}
              :
            </strong>
          </div>
          <div>
            {JSON.stringify(value)}
          </div>
        </div>
      ))}
    </code>
  )
}
