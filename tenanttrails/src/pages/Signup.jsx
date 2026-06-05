import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.includes('@')) e.email = 'Invalid email'
    if (password.length < 6) e.password = 'At least 6 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    return e
  }

  function handleSubmit(event) {
    event.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const result = register(name, email, password)
    if (result.error) { setErrors({ submit: result.error }); return }
    navigate('/dashboard')
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.brand}>TenantTrails</h1>
        <p style={styles.sub}>Create your account to submit reviews and comments.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full name</label>
            <input type="text" placeholder="Your name" value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }} />
            {errors.name && <span style={styles.err}>{errors.name}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }} />
            {errors.email && <span style={styles.err}>{errors.email}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="At least 6 characters" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }} />
            {errors.password && <span style={styles.err}>{errors.password}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input type="password" placeholder="Repeat password" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              style={{ ...styles.input, ...(errors.confirm ? styles.inputError : {}) }} />
            {errors.confirm && <span style={styles.err}>{errors.confirm}</span>}
          </div>
          {errors.submit && <span style={styles.err}>{errors.submit}</span>}
          <button type="submit" style={styles.btnPrimary}>Create Account</button>
        </form>
        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  bg: { minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  brand: { fontSize: 26, fontWeight: 700, color: '#2563eb', margin: '0 0 6px' },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 14, fontWeight: 500, color: '#374151' },
  input: { padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, width: '100%' },
  inputError: { borderColor: '#ef4444' },
  err: { fontSize: 12, color: '#ef4444' },
  btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  switchText: { textAlign: 'center', fontSize: 14, marginTop: 14, color: '#6b7280' },
  link: { color: '#2563eb', fontWeight: 500 },
}
