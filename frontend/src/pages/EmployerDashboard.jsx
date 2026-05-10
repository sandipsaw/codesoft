import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard.jsx'
import JobForm from '../components/JobForm.jsx'

const API_BASE = 'http://localhost:3000/api'

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/jobs`)
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      setMessage('Unable to load job postings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleJobPost = async (job) => {
    try {
      const response = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      })
      const createdJob = await response.json()
      if (!response.ok) {
        throw new Error(createdJob.error || 'Unable to post job')
      }
      setJobs((prev) => [createdJob, ...prev])
      setMessage('New job posted successfully.')
      return { success: true }
    } catch (error) {
      setMessage(error.message)
      return { success: false }
    }
  }

  return (
    <div className="page-content">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Employer dashboard</span>
          <h2>Manage your account and job postings</h2>
          <p>
            Post openings, review active listings, and keep your job board presence up to
            date.
          </p>
        </div>
        <div className="dashboard-summary">
          <div>
            <strong>Total listings</strong>
            <span>{jobs.length}</span>
          </div>
          <div>
            <strong>Open roles</strong>
            <span>{jobs.length}</span>
          </div>
        </div>
      </section>

      {message && <div className="global-message">{message}</div>}

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <JobForm onSubmit={handleJobPost} />
        </div>
        <div className="dashboard-panel">
          <div className="section-heading">
            <h3>Your job postings</h3>
            <p>Review active posts and keep your employer profile current.</p>
          </div>
          {loading ? (
            <p className="empty-state">Loading postings…</p>
          ) : jobs.length ? (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} detailUrl={`/jobs/${job._id}`} />
              ))}
            </div>
          ) : (
            <p className="empty-state">No active postings yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
