import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function JobCard({ job, onApply, detailUrl }) {
  const [showApply, setShowApply] = useState(false)
  const [applicant, setApplicant] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setApplicant((prev) => ({ ...prev, [name]: value }))
  }

  const submitApplication = async (event) => {
    event.preventDefault()
    if (!onApply) return
    setStatus('Sending...')
    const result = await onApply(job._id, applicant)
    setStatus(result.success ? 'Application sent!' : 'Failed to send.')
    if (result.success) {
      setApplicant({ name: '', email: '', message: '' })
      setShowApply(false)
    }
  }

  const highlightTags = [job.location, job.type].filter(Boolean)

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div>
          <div className="job-card-topline">
            <p className="job-company">{job.company}</p>
            <span className="job-badge">{job.type}</span>
          </div>
          <h3>{job.title}</h3>
          <p className="job-meta">{job.location}</p>
        </div>
        <div className="job-card-value">
          <span>{job.salary || 'Competitive'}</span>
        </div>
      </div>

      <div className="job-card-tags">
        {highlightTags.map((tag) => (
          <span key={tag} className="job-chip">
            {tag}
          </span>
        ))}
      </div>

      <p className="job-description">{job.description}</p>
      <p className="job-requirements"><strong>Requirements:</strong> {job.requirements || 'No specific requirements listed.'}</p>

      <div className="job-actions">
        {detailUrl && (
          <Link to={detailUrl} className="button secondary outline">
            View details
          </Link>
        )}
        {onApply && (
          <button type="button" className="button primary" onClick={() => setShowApply((value) => !value)}>
            {showApply ? 'Close application' : 'Apply now'}
          </button>
        )}
      </div>

      {showApply && onApply && (
        <form className="application-form" onSubmit={submitApplication}>
          <h4>Apply for this role</h4>
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
          <div className="form-actions">
            <button type="submit" className="button primary">
              Submit application
            </button>
            {status && <p className="form-status">{status}</p>}
          </div>
        </form>
      )}
    </article>
  )
}
