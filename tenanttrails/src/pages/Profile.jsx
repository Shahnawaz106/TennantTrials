import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_REVIEWS, MOCK_APARTMENTS } from '../data/mockData.js'
import StarRating from '../components/StarRating.jsx'
import ReviewDialog from '../components/ReviewDialog.jsx'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState(MOCK_REVIEWS.filter(r => r.userId === user?.id))
  const [editReview, setEditReview] = useState(null)
  const [search, setSearch] = useState('')

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  function handleLogout() { logout(); navigate('/login') }

  function handleDelete(reviewId) {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  function handleEdit({ rating, body }) {
    setReviews(prev => prev.map(r =>
      r.id === editReview.id ? { ...r, rating, body } : r
    ))
    setEditReview(null)
  }

  function getAptName(aptId) {
    return MOCK_APARTMENTS.find(a => a.id === aptId)?.name || 'Unknown'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <span style={styles.navBrand}>TenantTrails</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <span style={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Search apartments by address or neighbourhood..."
              value={search} onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.avatar}>{initials}</div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
          <button onClick={handleLogout} style={styles.signOutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={styles.container}>
        <Link to="/dashboard" style={styles.backLink}>← Back to apartments</Link>

        {/* Profile Header */}
        <div style={styles.profileCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={styles.bigAvatar}>{initials}</div>
            <div>
              <h1 style={styles.name}>{user?.name}</h1>
              <p style={styles.email}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={styles.statNum}>{reviews.length}</div>
              <div style={styles.statLabel}>REVIEWS</div>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Reviews</h2>

        {reviews.length === 0 && (
          <div style={styles.emptyState}>
            <p style={{ color: '#6b7280' }}>You haven't written any reviews yet.</p>
            <Link to="/dashboard" style={styles.browseBtn}>Browse Apartments</Link>
          </div>
        )}

        {reviews.map(r => (
          <div key={r.id} style={styles.reviewRow}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{getAptName(r.aptId)}</div>
              <StarRating rating={r.rating} />
              <p style={styles.reviewBody}>{r.body.length > 150 ? r.body.slice(0, 150) + '...' : r.body}</p>
            </div>
            <div style={styles.reviewActions}>
              <Link to={`/apartment/${r.aptId}`} style={styles.viewBtn}>View</Link>
              <button onClick={() => setEditReview(r)} style={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(r.id)} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editReview && (
        <ReviewDialog
          initial={editReview}
          onClose={() => setEditReview(null)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  )
}

const styles = {
  navbar: { background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 56, position: 'sticky', top: 0, zIndex: 10 },
  navBrand: { fontSize: 18, fontWeight: 700, color: '#2563eb' },
  searchIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 },
  searchInput: { paddingLeft: 32, paddingRight: 14, paddingTop: 8, paddingBottom: 8, border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 13, width: 320, background: '#f9fafb' },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 },
  signOutBtn: { background: 'none', border: 'none', fontSize: 14, color: '#6b7280', cursor: 'pointer' },
  container: { maxWidth: 900, margin: '0 auto', padding: '28px 28px' },
  backLink: { color: '#2563eb', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 20 },
  profileCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  bigAvatar: { width: 64, height: 64, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 },
  name: { fontSize: 22, fontWeight: 700, margin: '0 0 4px' },
  email: { fontSize: 14, color: '#6b7280', margin: 0 },
  statNum: { fontSize: 28, fontWeight: 800, color: '#2563eb' },
  statLabel: { fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: 1 },
  reviewRow: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 16 },
  reviewBody: { fontSize: 13, color: '#6b7280', margin: '8px 0 0', lineHeight: 1.5 },
  reviewActions: { display: 'flex', gap: 6, flexShrink: 0 },
  viewBtn: { background: 'none', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer', color: '#374151', textDecoration: 'none' },
  editBtn: { background: 'none', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer', color: '#374151' },
  deleteBtn: { background: 'none', border: '1px solid #fca5a5', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer', color: '#ef4444' },
  emptyState: { textAlign: 'center', padding: '40px 0' },
  browseBtn: { display: 'inline-block', marginTop: 12, background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 },
}
