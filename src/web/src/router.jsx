/* eslint-disable import/prefer-default-export */
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorPage from './common/ErrorPage'
import Home from './pages/Home'
import Forms from './pages/Forms'

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/forms', element: <Forms /> },
    ],
  },
])
