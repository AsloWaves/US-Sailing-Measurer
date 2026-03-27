import { Octokit } from '@octokit/rest'

export function createOctokitClient(token) {
  return new Octokit({ auth: token })
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

function fromBase64(b64) {
  return decodeURIComponent(escape(atob(b64)))
}

function buildPath(measurement) {
  const boat = slugify(measurement.boatName || 'unknown')
  const sail = slugify(measurement.sailType || 'unknown')
  const date = measurement.measurementDate || new Date().toISOString().split('T')[0]
  return `measurements/${boat}-${sail}-${date}-${measurement.id.slice(0, 8)}.json`
}

/**
 * Save a single measurement to GitHub as a JSON file.
 */
export async function saveMeasurementToGitHub(octokit, owner, repo, measurement) {
  const path = buildPath(measurement)
  const content = JSON.stringify(measurement, null, 2)
  const message = `Measurement: ${measurement.boatName} - ${measurement.sailType} (${measurement.measurementDate})`

  // Check if file exists (to get SHA for update)
  let sha
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path })
    sha = data.sha
  } catch (err) {
    if (err.status !== 404) throw err
    // File doesn't exist yet, that's fine
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: toBase64(content),
    ...(sha ? { sha } : {}),
  })

  return path
}

/**
 * Load all measurements from the GitHub repo.
 */
export async function loadMeasurementsFromGitHub(octokit, owner, repo) {
  let files
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: 'measurements' })
    files = Array.isArray(data) ? data : []
  } catch (err) {
    if (err.status === 404) return [] // No measurements directory yet
    throw err
  }

  const measurements = []
  for (const file of files) {
    if (!file.name.endsWith('.json')) continue
    try {
      const { data } = await octokit.rest.repos.getContent({ owner, repo, path: file.path })
      const json = fromBase64(data.content.replace(/\n/g, ''))
      measurements.push(JSON.parse(json))
    } catch {
      // Skip files that can't be parsed
    }
  }

  return measurements
}
