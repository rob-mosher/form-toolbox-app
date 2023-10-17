import { Outlet } from 'react-router-dom'
import Header from './common/Header'

export default function App() {
  return (
    <>

      <Header />
      <div className='ui fluid container' id='main'>
        <Outlet />
      </div>
    </>
  )
}
