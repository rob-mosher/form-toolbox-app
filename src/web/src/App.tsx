import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import { useGlobalState } from './context/useGlobalState'
import { mergeClassName } from './lib'
import 'react-toastify/dist/ReactToastify.css'
// import 'react-toastify/dist/ReactToastify.min.css'; // TODO: chose depending on dev or prod build
import Modal from './modals/lib/Modal'

export default function App() {
  const { isModalOpen, modalContent, hideModal } = useGlobalState()

  const { isCanvasFullSize } = useGlobalState()

  return (
    <div className='flex h-screen w-screen flex-col font-sans'>
      <Header />
      <main
        className={mergeClassName(
          'relative mt-[60px] flex grow flex-col pt-4 px-6',
          isCanvasFullSize && 'overflow-hidden px-0',
        )}
      >
        <Outlet />
      </main>
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onClose={hideModal}
      >
        {modalContent}
      </Modal>
    </div>
  )
}
