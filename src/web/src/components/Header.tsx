import { Link } from 'react-router-dom'
import HeaderButton from './HeaderButton'
import { MagnifyingGlass } from '../assets'

function Header() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('NavBar search awaiting implementation.')
  }

  return (
    <header className='fixed z-50 flex w-full justify-between border-b-2 border-b-gray-200 bg-white px-6 py-3'>

      <nav className='flex items-center gap-12'>
        <Link to='/'>
          <span>Home</span>
        </Link>
        <Link to='/forms'>
          Forms
        </Link>
        <Link to='/templates'>
          Templates
        </Link>
        <HeaderButton />
      </nav>

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

    </header>
  )
}

export default Header
