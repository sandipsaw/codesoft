import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

export default function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await auth.register(profile)
    if (result.success) {
      navigate('/candidate')
    } else {
      setStatus(result.message)
    }
  }

  return (
    <div className="page-content">
      <section className="auth-panel">
        <h2>Create candidate account</h2>
        <p>Sign up to track applications, upload resumes, and manage your profile.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="name" value={profile.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={profile.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={profile.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="button primary">Register</button>
          {status && <p className="form-status">{status}</p>}
        </form>
        <p className="auth-note">
          Already have an account? <Link to="/login">Log in</Link>.
        </p>
      </section>
    </div>
  )
}
