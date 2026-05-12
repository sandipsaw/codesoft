import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await auth.login(credentials)
    if (result.success) {
      toast.success('Login successfull')
        navigate('/candidate')
    } else {
      setStatus(result.message)
    }
  }

  return (
    <div className="page-content">
      <section className="auth-panel">
        <h2>Candidate login</h2>
        <p>Access your profile, view applications, and manage your job activity.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="button primary">Log in</button>
          {status && <p className="form-status">{status}</p>}
        </form>
        <p className="auth-note">
          New to the board? <Link to="/register">Create an account</Link>.
        </p>
      </section>
    </div>
  )
}
