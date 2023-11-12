import { Link } from 'react-router-dom'

export default function Content() {
  return (
    <div className='ten wide column ftbx-fitted-max'>
      <div className='ui top attached menu ftbx-sticky'>
        <div className='ui icon item'>
          <i className='mouse pointer icon' />
        </div>
        <div className='ui icon item'>
          <i className='search icon' />
        </div>
        <div className='ui icon item'>
          <i className='search plus icon' />
        </div>
        <div className='right menu'>
          <div className='ui right aligned category search item'>
            <div className='ui transparent icon input'>
              <input
                className='prompt'
                type='text'
                placeholder='Search text...'
              />
              <i className='search link icon' />
            </div>
            <div className='results' />
          </div>
          <div className='ui dropdown item'>
            <i className='bars icon' />
            Page
            <i className='dropdown icon' />
            <div className='menu'>
              {/* TODO page number logic */}
              <Link className='item' to='#todo'>
                Page 1
              </Link>
              {/* end page number logic %} */}
            </div>
          </div>
        </div>
      </div>
      <div className='ftbx-scanned-docs'>
        {/* TODO page artifact logic */}
        <div
          className='ui fluid ftbx-scanned-doc'
          id='ftbx-scanned-doc-page-TODO'
        >
          <img
            className='ui fluid image'
            alt='page1'
            src='' /* Local or S3 image via pre-signed key */
          />
        </div>
        {/* end page artifact logic */}
      </div>
    </div>
  )
}
