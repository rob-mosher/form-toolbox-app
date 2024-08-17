import type { FormType } from '../types'

type FormTypeDetailsProps = {
  formType: FormType;
}

export default function FormTypeDetails({ formType }: FormTypeDetailsProps) {
  return (
    <code>
      {Object.entries(formType).map(([key, value]) => (
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
