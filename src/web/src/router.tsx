/* eslint-disable import/prefer-default-export */

// NOTE Ensure any changes to path are also reflected in ./components/HeaderButton.tsx

import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorPage from './components/ErrorPage'
import FormEdit from './pages/FormEdit'
import FormList from './pages/FormList'
import FormView from './pages/FormView'
import Home from './pages/Home'
import TemplateEdit from './pages/TemplateEdit'
import TemplateList from './pages/TemplateList'
import TemplateView from './pages/TemplateView'

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/forms', element: <FormList /> },
      { path: '/forms/:formId', element: <FormView /> },
      { path: '/forms/:formId/edit', element: <FormEdit /> },
      { path: '/forms/:formId/view', element: <FormView /> },
      { path: '/templates', element: <TemplateList /> },
      { path: '/templates/:templateId', element: <TemplateView /> },
      { path: '/templates/:templateId/edit', element: <TemplateEdit /> },
      { path: '/templates/:templateId/view', element: <TemplateView /> },
    ],
  },
])
