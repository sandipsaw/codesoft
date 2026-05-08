import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { Link } from 'react-router-dom'

const API_BASE = '/api'

export default function CandidateDashboard() {
  const auth = useAuth()
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState({ name: auth.user?.name || '', email: auth.user?.email || '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!auth.user) return
    setForm({ name: auth.user.name, email: auth.user.email })
    async function loadApplications() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/candidate/applications`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        const data = await response.json()
        setApplications(data)
      } catch (error) {
        setMessage('Unable to load your applications.')
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [auth.user, auth.token])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to update profile')
      }
      setMessage('Profile updated successfully.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="page-content">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Candidate dashboard</span>
          <h2>Manage your profile and applications</h2>
          <p>Keep your candidate profile updated and review every job you applied for.</p>
        </div>
        <div className="dashboard-summary">
          <div>
            <strong>Applications</strong>
            <span>{applications.length}</span>
          </div>
          <div>
            <strong>Account</strong>
            <span>{auth.user?.name}</span>
          </div>
        </div>
      </section>

      {message && <div className="global-message">{message}</div>}

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="section-heading">
            <h3>Profile</h3>
            <p>Update your name and email for future applications.</p>
          </div>
          <form className="auth-form" onSubmit={handleUpdateProfile}>
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <button type="submit" className="button primary">Update profile</button>
          </form>
        </div>

        <div className="dashboard-panel">
          <div className="section-heading">
            <h3>My applications</h3>
            <p>Track your resume submissions, status, and job details.</p>
          </div>
          {loading ? (
            <p className="empty-state">Loading applications…</p>
          ) : applications.length ? (
            <div className="applications-list">
              {applications.map((application) => (
                <article key={`${application.jobId}-${application.appliedAt}`} className="application-card">
                  <div>
                    <h4>{application.title}</h4>
                    <p>{application.company} · {application.location}</p>
                    <p className="application-date">Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="application-actions">
                    <a href={`/jobs/${application.jobId}`} className="button secondary">View job</a>
                    {application.resumeUrl && (
                      <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="button secondary">
                        Resume
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">You have not applied for any jobs yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
