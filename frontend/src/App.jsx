import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import JobListingsPage from './pages/JobListingsPage.jsx'
import JobDetailPage from './pages/JobDetailPage.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import CandidateDashboard from './pages/CandidateDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider, useAuth } from './auth/AuthProvider.jsx'
import './App.css'

function AppShell() {
  const auth = useAuth()
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return (
      localStorage.getItem('jobboard_theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('jobboard_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Job Board</h1>
          <p>Employer postings and candidate tools for secure job search.</p>
        </div>

        <nav className="site-nav">
          <button type="button" className="button secondary nav-button theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/dashboard">Employer Dashboard</NavLink>
          {auth.user ? (
            <>
              <NavLink to="/candidate">My Dashboard</NavLink>
              <button type="button" className="button secondary nav-button" onClick={auth.logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="page-layout">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListingsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/dashboard" element={<EmployerDashboard />} />
          <Route
            path="/candidate"
            element={
              <ProtectedRoute>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
