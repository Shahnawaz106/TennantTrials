import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.brand}>TenantTrails</h1>
        <p style={styles.tagline}>
          Honest reviews from real tenants.<br />Read before you rent.
        </p>
        <div style={styles.btnGroup}>
          <Link to="/login" style={styles.btnPrimary}>Sign In</Link>
          <Link to="/signup" style={styles.btnOutline}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '48px 40px',
    textAlign: 'center', maxWidth: 420, width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  brand: { fontSize: 32, fontWeight: 700, color: '#2563eb', marginBottom: 12 },
  tagline: { fontSize: 16, color: '#6b7280', lineHeight: 1.6, marginBottom: 32 },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: 12 },
  btnPrimary: {
    background: '#2563eb', color: '#fff', padding: '12px', borderRadius: 8,
    textDecoration: 'none', fontWeight: 600, fontSize: 15,
  },
  btnOutline: {
    border: '1.5px solid #2563eb', color: '#2563eb', padding: '12px', borderRadius: 8,
    textDecoration: 'none', fontWeight: 600, fontSize: 15,
  },
}
