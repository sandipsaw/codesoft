import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import JobCard from '../components/JobCard.jsx'
import heroImage from '../assets/employee.jpg'

const API_BASE = import.meta.env.VITE_API_URL

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

  const stats = [
    { value: '850+', label: 'Jobs posted' },
    { value: '424+', label: 'Trusted employers' },
    { value: '30+', label: 'Career experts' },
  ]

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Unlock your potential</span>
            <h1>Unlock your skill potential with JobBoard</h1>
            <p>
              Discover the best remote, hybrid, and full-time roles curated for
              tech talent. Build your career with trusted companies and expert
              guidance on every step.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="button primary">
                Browse jobs
              </Link>
              <Link to="/dashboard" className="button secondary">
                Employer dashboard
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <span>{stat.value}</span>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <p className="card-eyebrow">Featured hiring now</p>
              <h2>Fast-growing teams are hiring today</h2>
              <p>See the latest openings, join top companies, and move your career forward.</p>
              <div className="card-pill-row">
                <span>Remote</span>
                <span>Full-time</span>
                <span>Engineering</span>
              </div>
              <div className="card-footer">
                <div>
                  <strong>12</strong>
                  <p>New roles</p>
                </div>
                <div>
                  <strong>92%</strong>
                  <p>Interview rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="spotlight-section">
        <div className="spotlight-grid">
          <article className="spotlight-card spotlight-card-primary">
            <div>
              <span className="eyebrow">Find your dream job</span>
              <h2>Find your dream job and career path</h2>
              <p>
                Search roles matched to your skills, location, and ambitions.
                Get real-time alerts and apply with confidence.
              </p>
            </div>
            <img src={heroImage} alt="Job search illustration" className="spotlight-image" />
            <Link to="/jobs" className="button primary">
              View all jobs
            </Link>
          </article>

          <article className="spotlight-card spotlight-card-secondary">
            <div className="feature-list">
              <div className="feature-item">
                <strong>Job board</strong>
                <p>Browse verified employer openings across industries.</p>
              </div>
              <div className="feature-item">
                <strong>Career support</strong>
                <p>Use tools that help you prepare and apply faster.</p>
              </div>
              <div className="feature-item">
                <strong>Employer access</strong>
                <p>Post vacancies and reach active candidates in minutes.</p>
              </div>
            </div>
          </article>
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
