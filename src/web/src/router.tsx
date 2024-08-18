/* eslint-disable import/prefer-default-export */

// NOTE Ensure any changes to path are also reflected in ./components/HeaderButton.tsx

import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorPage from './components/ErrorPage'
import FormEdit from './pages/FormEdit'
import FormView from './pages/FormView'
import Forms from './pages/Forms'
import Home from './pages/Home'
import TemplateEdit from './pages/TemplateEdit'
import TemplateView from './pages/TemplateView'
import Templates from './pages/Templates'
import UploadForm from './pages/UploadForm'

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/forms', element: <Forms /> },
      { path: '/forms/:formId', element: <FormView /> },
      { path: '/forms/:formId/edit', element: <FormEdit /> },
      { path: '/forms/:formId/view', element: <FormView /> },
      { path: '/templates', element: <Templates /> },
      { path: '/templates/:templateId', element: <TemplateView /> },
      { path: '/templates/:templateId/edit', element: <TemplateEdit /> },
      { path: '/templates/:templateId/view', element: <TemplateView /> },
      { path: '/upload', element: <UploadForm /> },
    ],
  },
])
