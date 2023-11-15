import {
  Button, Divider, Form, Header
} from 'semantic-ui-react'

export default function EditTab({
  formTypes,
}) {
  const versions = [
    {
      key: 1,
      value: 1,
      text: 'WIP',
    },
  ]

  return (
    <div className='ui bottom attached active tab segment' data-tab='edit'>
      <Form>
        <Divider horizontal>
          <Header size='small' content='Form Type' className='ftbx-uppercase' />
        </Divider>

        <Form.Select label='Type' options={formTypes} placeholder='Select Type' />
        <Form.Select label='Version' options={versions} placeholder='Select Version' />

        <Button primary>Apply</Button>
        <Button>Detect</Button>

        <Divider horizontal>
          <Header size='small' content='Form' className='ftbx-uppercase' />
        </Divider>

        <Form.Field>
          <label htmlFor='formField1'>
            Field 1
            <input
              type='text'
              name='title'
              id='formField1'
              className='ftbx-mono'
              defaultValue='Example Data'
            />
          </label>
        </Form.Field>

        <Form.Field>
          <label htmlFor='formField1'>
            Field 2
            <input
              type='text'
              name='title'
              id='formField1'
              className='ftbx-mono'
              defaultValue='More example data'
            />
          </label>
        </Form.Field>

        <Form.Field>
          <label htmlFor='formField1'>
            Field 3
            <input
              type='text'
              name='title'
              id='formField1'
              className='ftbx-mono'
              defaultValue='Even more example data'
            />
          </label>
        </Form.Field>
      </Form>
    </div>
  )
}
