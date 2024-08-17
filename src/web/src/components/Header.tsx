import { useNavigate, Link } from 'react-router-dom'
import { MagnifyingGlass } from '../assets'
import Button from './Button'

function Header() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('NavBar search awaiting implementation.')
  }

  const navigate = useNavigate()

  return (
    <div className='bg-indigo-300'>
      <div className='fixed z-50 flex w-full justify-between border-b-2 border-b-gray-200 bg-white px-6 py-3'>

        <div className='flex items-center gap-12'>
          <Link to='/'>
            <span>Home</span>
          </Link>
          <Link to='/forms'>
            Forms
          </Link>
          <Button ariaLabel='Upload' primary onClick={() => navigate('/upload')}>
            Upload
          </Button>
        </div>

        <form className='flex rounded-lg bg-white p-2 ring-1 ring-gray-400 focus-within:ring-2 focus-within:ring-gray-600' onSubmit={handleSubmit}>
          <label className='sr-only' htmlFor='navbar-search'>Search</label>
          <input
            className='bg-inherit focus:outline-none'
            id='navbar-search'
            name='search'
            placeholder='Search'
            type='text'
          />
          <button type='submit' aria-label='Submit search'>
            <MagnifyingGlass />
          </button>
        </form>

      </div>
    </div>
  )
}

export default Header
