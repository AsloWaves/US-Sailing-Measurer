import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import JobsList from './components/JobsList'
import JobDetail from './components/JobDetail'
import JobForm from './components/JobForm'
import BoatsList from './components/BoatsList'
import BoatDetail from './components/BoatDetail'
import BoatForm from './components/BoatForm'
import Dashboard from './components/Dashboard'
import MeasurementForm from './components/MeasurementForm'
import MeasurementDetail from './components/MeasurementDetail'
import Settings from './components/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Jobs (home)
      { index: true, element: <JobsList /> },
      { path: 'jobs/new', element: <JobForm /> },
      { path: 'job/:id', element: <JobDetail /> },
      { path: 'job/:id/edit', element: <JobForm /> },

      // Boats
      { path: 'boats', element: <BoatsList /> },
      { path: 'boats/new', element: <BoatForm /> },
      { path: 'boat/:id', element: <BoatDetail /> },
      { path: 'boat/:id/edit', element: <BoatForm /> },

      // Measurements
      { path: 'measurements', element: <Dashboard /> },
      { path: 'new', element: <MeasurementForm /> },
      { path: 'measurement/:id', element: <MeasurementDetail /> },
      { path: 'measurement/:id/edit', element: <MeasurementForm /> },

      // Settings
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
