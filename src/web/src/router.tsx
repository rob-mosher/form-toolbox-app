/* eslint-disable import/prefer-default-export */
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorPage from './components/ErrorPage'
import MainWrapper from './components/MainWrapper'
import FormEdit from './pages/FormEdit'
import FormView from './pages/FormView'
import Forms from './pages/Forms'
import Home from './pages/Home'
import UploadForm from './pages/UploadForm'

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainWrapper />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/forms', element: <Forms /> },
          { path: '/forms/:formId', element: <FormView /> },
          { path: '/forms/:formId/view', element: <FormView /> },
          { path: '/forms/:formId/edit', element: <FormEdit /> },
          { path: '/upload', element: <UploadForm /> },
        ],
      },
    ],
  },
])
