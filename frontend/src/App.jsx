import { useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">


          <button
            type="button"
            className={`mobile-menu-button ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>

          <nav className={`site-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="brand-logo" onClick={closeMobileMenu}>

              <div className="brand-copy">
                <span className="brand-text">TalentHub</span>
                <span className="brand-tagline">Find your next dream role</span>
              </div>
            </Link>

            
            <NavLink to="/" end onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/jobs" onClick={closeMobileMenu}>
              Jobs
            </NavLink>
            <NavLink to="/dashboard" onClick={closeMobileMenu}>
              Employer Dashboard
            </NavLink>
            {auth.user ? (
              <>
                <NavLink to="/candidate" onClick={closeMobileMenu}>
                  My Dashboard
                </NavLink>
                <button type="button" className="button secondary nav-button" onClick={() => {
                  auth.logout()
                  closeMobileMenu()
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMobileMenu}>
                  Login
                </NavLink>
                <NavLink to="/register" onClick={closeMobileMenu}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
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
