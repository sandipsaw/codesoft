import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import JobCard from '../components/JobCard.jsx'

const API_BASE = '/api'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/jobs`)
        const jobs = await response.json()
        setFeatured(jobs.slice(0, 3))
      } catch (err) {
        setError('Unable to load featured jobs.')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  return (
    <div className="home-page">
      <section className="hero-panel">
        <span className="eyebrow">Welcome</span>
        <h1>Welcome to the job board.</h1>
        <p>
          Find open roles, explore company opportunities, and let employers post new
          job openings in seconds. Browse jobs or manage your postings from the dashboard.
        </p>
        <div className="hero-actions">
          <Link to="/jobs" className="button primary">
            Browse listings
          </Link>
          <Link to="/dashboard" className="button secondary">
            Employer dashboard
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <h2>Featured job openings</h2>
          <p>Latest opportunities across development, design, and remote work.</p>
        </div>

        {loading ? (
          <p className="empty-state">Loading featured jobs…</p>
        ) : featured.length ? (
          <div className="featured-grid">
            {featured.map((job) => (
              <JobCard key={job._id} job={job} detailUrl={`/jobs/${job._id}`} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No featured jobs available yet.</p>
        )}
      </section>
    </div>
  )
}
