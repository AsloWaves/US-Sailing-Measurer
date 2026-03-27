import { createContext, useContext, useState, useEffect } from 'react'
import { getSetting, saveSetting } from '../lib/db'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [units, setUnitsState] = useState('ftin')
  const [measurerName, setMeasurerNameState] = useState('')
  const [measurerCert, setMeasurerCertState] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const [u, mn, mc] = await Promise.all([
        getSetting('units'),
        getSetting('measurerName'),
        getSetting('measurerCert'),
      ])
      if (u) setUnitsState(u)
      if (mn) setMeasurerNameState(mn)
      if (mc) setMeasurerCertState(mc)
      setLoaded(true)
    }
    load()
  }, [])

  const setUnits = (v) => {
    setUnitsState(v)
    saveSetting('units', v)
  }
  const setMeasurerName = (v) => {
    setMeasurerNameState(v)
    saveSetting('measurerName', v)
  }
  const setMeasurerCert = (v) => {
    setMeasurerCertState(v)
    saveSetting('measurerCert', v)
  }

  return (
    <SettingsContext.Provider value={{
      units, setUnits,
      measurerName, setMeasurerName,
      measurerCert, setMeasurerCert,
      loaded,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
