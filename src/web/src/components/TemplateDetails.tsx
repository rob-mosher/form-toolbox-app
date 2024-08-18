import type { Template } from '../types'

type TemplateDetailsProps = {
  template: Template;
}

export default function TemplateDetails({ template }: TemplateDetailsProps) {
  return (
    <code>
      {Object.entries(template).map(([key, value]) => (
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