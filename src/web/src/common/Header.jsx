import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

function Header() {
  function handleSubmit(e) {
    e.preventDefault()
    console.log('handleSubmit prevented form defaults.')
  }

  return (
    <div id='header'>
      <div id='sub-header' className='ui fixed top sticky fluid container' style={{ padding: '6px 0' }}>

        {/* LEFT */}
        <div className='ui menu secondary'>
          <Link className='ui item' to='/'>
            <i className='layer group icon' />
            <span className='tool-name' style={{ textTransform: 'uppercase' }}>Home</span>
          </Link>
          <Link className='item' to='/forms'>
            Forms
          </Link>
          <div className='ui item'>
            <Button primary as={Link} to='/'>
              Upload
            </Button>
          </div>
          {/* END LEFT */}

          {/* RIGHT */}
          <div className='right menu'>
            <div className='ui item' style={{ padding: 0 }}>
              <form className='ui form' onSubmit={handleSubmit} style={{ margin: 0, padding: '0px 8px' }}>
                <div className='ui search'>
                  <div className='ui icon input'>
                    <input
                      className='prompt'
                      name='search'
                      type='text'
                      placeholder='Search'
                    />
                    <i className='search icon' />
                  </div>
                  <div className='results' />
                </div>
              </form>
            </div>
            {/* END RIGHT */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
