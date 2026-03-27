import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

function getStored(key) {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}

export function AuthProvider({ children }) {
  const [githubToken, setGithubTokenState] = useState(() => getStored('githubToken'))
  const [githubRepo, setGithubRepoState] = useState(() => getStored('githubRepo') || 'AsloWaves/sail-measurements')

  const setGithubToken = (v) => {
    setGithubTokenState(v)
    try { localStorage.setItem('githubToken', v) } catch {}
  }

  const setGithubRepo = (v) => {
    setGithubRepoState(v)
    try { localStorage.setItem('githubRepo', v) } catch {}
  }

  const isAuthenticated = Boolean(githubToken && githubRepo)

  // Parse owner/repo
  const [owner, repo] = githubRepo.includes('/')
    ? githubRepo.split('/')
    : ['', '']

  return (
    <AuthContext.Provider value={{
      githubToken, setGithubToken,
      githubRepo, setGithubRepo,
      isAuthenticated,
      owner,
      repo,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
