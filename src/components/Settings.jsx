import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import Input from './ui/Input'
import Button from './ui/Button'
import Card from './ui/Card'

export default function Settings() {
  const { units, setUnits, measurerName, setMeasurerName, measurerCert, setMeasurerCert } = useSettings()
  const { githubToken, setGithubToken, githubRepo, setGithubRepo, isAuthenticated } = useAuth()
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const { Octokit } = await import('@octokit/rest')
      const octokit = new Octokit({ auth: githubToken })
      const [owner, repo] = githubRepo.split('/')
      await octokit.rest.repos.get({ owner, repo })
      setTestResult({ ok: true, msg: 'Connected successfully!' })
    } catch (err) {
      setTestResult({ ok: false, msg: err.status === 404 ? 'Repository not found' : err.status === 401 ? 'Invalid token' : err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Settings</h1>

      {/* Measurer Info */}
      <Card className="p-4 space-y-4">
        <h2 className="text-sm font-medium text-navy-500">Measurer Information</h2>
        <Input
          label="Name"
          type="text"
          value={measurerName}
          onChange={(e) => setMeasurerName(e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Certification Number"
          type="text"
          value={measurerCert}
          onChange={(e) => setMeasurerCert(e.target.value)}
          placeholder="e.g., USM-1234"
        />
      </Card>

      {/* Units */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-medium text-navy-500">Preferred Units</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setUnits('metric')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${units === 'metric' ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
          >
            Metric (m)
          </button>
          <button
            onClick={() => setUnits('imperial')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${units === 'imperial' ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
          >
            Imperial (ft)
          </button>
        </div>
      </Card>

      {/* GitHub */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-navy-500">GitHub Cloud Sync</h2>
          <span className={`text-xs font-medium ${isAuthenticated ? 'text-sync-green' : 'text-navy-400'}`}>
            {isAuthenticated ? 'Configured' : 'Not configured'}
          </span>
        </div>
        <Input
          label="Personal Access Token"
          type="password"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
        />
        <Input
          label="Repository (owner/repo)"
          type="text"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          placeholder="AsloWaves/sail-measurements"
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={testConnection}
            disabled={!githubToken || !githubRepo || testing}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          {githubToken && (
            <Button variant="ghost" onClick={() => { setGithubToken(''); setTestResult(null) }}>
              Clear Token
            </Button>
          )}
        </div>
        {testResult && (
          <p className={`text-sm ${testResult.ok ? 'text-sync-green' : 'text-sync-red'}`}>
            {testResult.msg}
          </p>
        )}
        <p className="text-xs text-navy-400">
          Create a fine-grained token at GitHub with "Contents" read/write permission scoped to your measurements repo.
        </p>
      </Card>

      {/* About */}
      <Card className="p-4 space-y-2">
        <h2 className="text-sm font-medium text-navy-500">About</h2>
        <p className="text-sm text-navy-700">
          US Sailing Measurer v1.0.0
        </p>
        <p className="text-xs text-navy-400">
          Conforms to US Sailing, ORR, ORC, and IRC measurement guidelines.
          Area calculations use official ORC formulas.
        </p>
      </Card>
    </div>
  )
}
