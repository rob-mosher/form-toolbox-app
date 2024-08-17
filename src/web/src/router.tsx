/* eslint-disable import/prefer-default-export */
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorPage from './components/ErrorPage'
import FormEdit from './pages/FormEdit'
import FormTypeEdit from './pages/FormTypeEdit'
import FormTypeView from './pages/FormTypeView'
import FormTypes from './pages/FormTypes'
import FormView from './pages/FormView'
import Forms from './pages/Forms'
import Home from './pages/Home'
import UploadForm from './pages/UploadForm'

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/forms', element: <Forms /> },
      { path: '/forms/:formId', element: <FormView /> },
      { path: '/forms/:formId/view', element: <FormView /> },
      { path: '/forms/:formId/edit', element: <FormEdit /> },
      { path: '/formtypes', element: <FormTypes /> },
      { path: '/formtypes/:formTypeId', element: <FormTypeView /> },
      { path: '/formtypes/:formTypeId/view', element: <FormTypeView /> },
      { path: '/formtypes/:formTypeId/edit', element: <FormTypeEdit /> },
      { path: '/upload', element: <UploadForm /> },
    ],
  },
])
