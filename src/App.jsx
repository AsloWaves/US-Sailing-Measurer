import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import MeasurementForm from './components/MeasurementForm'
import MeasurementDetail from './components/MeasurementDetail'
import Settings from './components/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'new', element: <MeasurementForm /> },
      { path: 'measurement/:id', element: <MeasurementDetail /> },
      { path: 'measurement/:id/edit', element: <MeasurementForm /> },
      { path: 'settings', element: <Settings /> },
    ]
  }
], {
  basename: '/US-Sailing-Measurer'
})

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </SettingsProvider>
  )
}
