export default function InfoTab({ form }) {
  return (
    <div className='ui bottom attached active tab segment' data-tab='info'>
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
              {value}
            </div>
          </div>
        ))}
      </code>
    </div>
  )
}
