import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard.jsx'

const API_BASE = import.meta.env.VITE_API_URL

export default function JobListingsPage() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchJobs = async (query = '') => {
    try {
      setLoading(true)
      const searchQuery = query ? `?search=${encodeURIComponent(query)}` : ''
      const response = await fetch(`${API_BASE}/jobs${searchQuery}`)
      const data = await response.json()
      setJobs(data)
      setMessage('')
    } catch (error) {
      setMessage('Unable to load job listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    await fetchJobs(searchTerm)
  }

  return (
    <div className="page-content">
      <section className="search-section">
        <div className="section-heading">
          <h2>Job listings</h2>
          <p>Search available openings by title, company, or location.</p>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search jobs"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit" className="button primary">
            Search
          </button>
        </form>
      </section>

      {message && <div className="global-message">{message}</div>}

      <section className="jobs-grid">
        {loading ? (
          <p className="empty-state">Loading jobs…</p>
        ) : jobs.length ? (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} detailUrl={`/jobs/${job._id}`} />
          ))
        ) : (
          <p className="empty-state">No jobs found. Try a different search.</p>
        )}
      </section>
    </div>
  )
}
