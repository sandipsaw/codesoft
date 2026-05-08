import { useState } from 'react'

export default function JobForm({ onSubmit }) {
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
  })
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setJob((prev) => ({ ...prev, [name]: value }))
  }

  const submitJob = async (event) => {
    event.preventDefault()
    setStatus('Posting job...')
    const result = await onSubmit(job)
    if (result.success) {
      setJob({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        requirements: '',
      })
      setStatus('Job posted successfully!')
    } else {
      setStatus('Unable to post job. Please try again.')
    }
  }

  return (
    <form className="employer-form" onSubmit={submitJob}>
      <h2>Post a job</h2>
      <div className="grid two-column">
        <label>
          Job title
          <input name="title" value={job.title} onChange={handleChange} required />
        </label>
        <label>
          Company
          <input name="company" value={job.company} onChange={handleChange} required />
        </label>
      </div>
      <div className="grid two-column">
        <label>
          Location
          <input name="location" value={job.location} onChange={handleChange} required />
        </label>
        <label>
          Job type
          <select name="type" value={job.type} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>
        </label>
      </div>
      <label>
        Salary range
        <input name="salary" value={job.salary} onChange={handleChange} required />
      </label>
      <label>
        Job description
        <textarea name="description" value={job.description} onChange={handleChange} rows="5" required />
      </label>
      <label>
        Requirements
        <textarea name="requirements" value={job.requirements} onChange={handleChange} rows="4" />
      </label>
      <div className="form-actions">
        <button type="submit" className="button primary">Post job</button>
        {status && <span className="form-status">{status}</span>}
      </div>
    </form>
  )
}
