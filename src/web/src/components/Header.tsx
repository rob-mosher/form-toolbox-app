import { FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import HeaderButton from './HeaderButton'
import { MagnifyingGlass, ScrewdriverWrench } from '../assets'

function Header() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log('NavBar search awaiting implementation.')
  }

  return (
    <header className='fixed z-50 flex w-full justify-between border-b-2 border-b-gray-200 bg-white px-6 py-3'>

      <nav className='flex items-center gap-12 text-gray-500'>
        <NavLink
          to='/'
          className={({ isActive }) => (isActive ? 'text-blue-700 ' : undefined)}
          end
        >
          <div className='flex items-center justify-center'>
            <ScrewdriverWrench className='mr-4 size-7 text-blue-500' />
            {' '}
            Home
          </div>
        </NavLink>
        <NavLink
          to='/forms'
          className={({ isActive }) => (isActive ? 'text-blue-700' : undefined)}
        >
          Forms
        </NavLink>
        <NavLink
          to='/templates'
          className={({ isActive }) => (isActive ? 'text-blue-700' : undefined)}
        >
          Templates
        </NavLink>
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
