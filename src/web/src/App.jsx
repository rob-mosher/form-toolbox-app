import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './common/Header'
import 'react-toastify/dist/ReactToastify.css'
// import 'react-toastify/dist/ReactToastify.min.css'; // TODO chose depending on dev or prod build

export default function App() {
  return (
    <>
      <Header />
      <div className='ui fluid container' id='main'>
        <Outlet />
      </div>
      <ToastContainer />
    </>
  )
}
