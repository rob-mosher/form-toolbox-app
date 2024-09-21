import { FormEvent } from 'react'
import {
  ChevronDown, Cursor, MagnifyingGlass, MagnifyingGlassMinus, MagnifyingGlassPlus,
} from '../assets'

export default function ContentToolbar() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log('Form search awaiting implementation.')
  }

  return (
    <div className='sticky top-0 z-10 flex w-full items-center justify-between border-y border-r border-y-stone-300 border-r-stone-300 bg-white'>
      <div className='flex'>
        <div className='flex items-center justify-center p-3'>
          <Cursor />
        </div>
        <div className='flex items-center justify-center p-3'>
          <MagnifyingGlassMinus />
        </div>
        <div className='flex items-center justify-center p-3'>
          <MagnifyingGlassPlus />
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <form
          aria-label='Search form'
          onSubmit={handleSubmit}
          className='flex border-x border-x-gray-300 p-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500'
        >
          <label htmlFor='form-search' className='sr-only'>Search form</label>
          <input id='form-search' className='bg-inherit focus:outline-none' type='text' placeholder='Search text...' />
          <button type='submit' aria-label='Submit search'>
            <MagnifyingGlass />
          </button>
        </form>
        <div className='flex'>
          <div>Page 1</div>
          <ChevronDown />
        </div>
      </div>
    </div>
  )
}
