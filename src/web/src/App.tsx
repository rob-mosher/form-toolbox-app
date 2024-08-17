import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import { mergeClassName } from './lib/utils'
import 'react-toastify/dist/ReactToastify.css'
// import 'react-toastify/dist/ReactToastify.min.css'; // TODO chose depending on dev or prod build

export default function App() {
  const [isContentFullSize, setIsContentFullSize] = useState(false)

  return (
    <div className='flex h-screen w-screen flex-col font-sans'>
      <Header />
      <main
        className={mergeClassName(
          'relative mt-[60px] flex grow flex-col pt-4 px-6',
          isContentFullSize && 'overflow-hidden px-0',
        )}
      >
        <Outlet context={{ setIsContentFullSize }} />
      </main>
      <ToastContainer />
    </div>
  )
}
