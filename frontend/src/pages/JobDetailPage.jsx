import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

const API_BASE = import.meta.env.VITE_API_URL

export default function JobDetailPage() {
  const { id } = useParams()
  const auth = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applicant, setApplicant] = useState({ name: '', email: '', message: '' })
  const [resume, setResume] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/jobs/${id}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Job not found')
        }
        const data = await response.json()
        setJob(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [id])

  useEffect(() => {
    if (auth.user) {
      setApplicant({ name: auth.user.name, email: auth.user.email, message: '' })
    }
  }, [auth.user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setApplicant((prev) => ({ ...prev, [name]: value }))
  }

  const submitApplication = async (event) => {
    event.preventDefault()
    setStatus('Sending application...')

    const formData = new FormData()
    formData.append('name', applicant.name)
    formData.append('email', applicant.email)
    formData.append('message', applicant.message)
    if (resume) {
      formData.append('resume', resume)
    }

    try {
      const token = localStorage.getItem('jobboard_token')

      const response = await fetch(`${API_BASE}/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })


      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit application')
      }
      setStatus('Application submitted successfully.')
      setApplicant({ name: auth.user?.name || '', email: auth.user?.email || '', message: '' })
      setResume(null)
    } catch (err) {
      setStatus(err.message)
    }
  }

  if (loading) {
    return (
      <div className="page-content">
        <p className="empty-state">Loading job details…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <p className="empty-state">{error}</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <section className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <span className="eyebrow">{job.company}</span>
            <h2>{job.title}</h2>
            <p className="job-company">{job.location} · {job.type}</p>
          </div>
          <span className="job-badge">{job.salary}</span>
        </div>

        <div className="job-detail-body">
          <div>
            <h3>About this role</h3>
            <p>{job.description}</p>
            <h3>Requirements</h3>
            <p>{job.requirements || 'No specific requirements listed.'}</p>
          </div>

          <aside className="application-panel">
            <h3>Apply now</h3>
            <p>Send your application directly to the employer.</p>
            <form className="application-form" onSubmit={submitApplication}>
              <label>
                Name
                <input name="name" value={applicant.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={applicant.email} onChange={handleChange} required />
              </label>
              <label>
                Message
                <textarea name="message" value={applicant.message} onChange={handleChange} rows="4" />
              </label>
              <label>
                Resume upload
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} />
              </label>
              <button type="submit" className="button primary">Submit application</button>
              {status && <p className="form-status">{status}</p>}
            </form>
          </aside>
        </div>
      </section>
    </div>
  )
}
