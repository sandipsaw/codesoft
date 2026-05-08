import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-content">
      <section className="empty-state">
        <h2>Page not found</h2>
        <p>The page you were looking for does not exist.</p>
        <Link to="/" className="button primary">
          Back to home
        </Link>
      </section>
    </div>
  )
}
