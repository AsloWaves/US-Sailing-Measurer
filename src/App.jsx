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
import StandingRiggingForm from './components/StandingRiggingForm'
import StandingRiggingDetail from './components/StandingRiggingDetail'
import RunningRiggingForm from './components/RunningRiggingForm'
import RunningRiggingDetail from './components/RunningRiggingDetail'
import SailRepairForm from './components/SailRepairForm'
import SailRepairDetail from './components/SailRepairDetail'
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
      { path: 'job/:jobId/measurement/new', element: <MeasurementForm /> },

      // Standing Rigging
      { path: 'standing-rigging/new', element: <StandingRiggingForm /> },
      { path: 'standing-rigging/:id', element: <StandingRiggingDetail /> },
      { path: 'standing-rigging/:id/edit', element: <StandingRiggingForm /> },

      // Running Rigging
      { path: 'running-rigging/new', element: <RunningRiggingForm /> },
      { path: 'running-rigging/:id', element: <RunningRiggingDetail /> },
      { path: 'running-rigging/:id/edit', element: <RunningRiggingForm /> },

      // Sail Repair
      { path: 'sail-repair/new', element: <SailRepairForm /> },
      { path: 'sail-repair/:id', element: <SailRepairDetail /> },
      { path: 'sail-repair/:id/edit', element: <SailRepairForm /> },

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
