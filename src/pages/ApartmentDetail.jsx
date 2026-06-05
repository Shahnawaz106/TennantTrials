import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_APARTMENTS, MOCK_REVIEWS } from '../data/mockData.js'
import AISummary from '../components/AISummary.jsx'
import StarRating from '../components/StarRating.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import ReviewDialog from '../components/ReviewDialog.jsx'

export default function ApartmentDetail() {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const apt = MOCK_APARTMENTS.find(a => a.id === Number(id))
  const [reviews, setReviews] = useState(MOCK_REVIEWS.filter(r => r.aptId === Number(id)))
  const [showReview, setShowReview] = useState(false)
  const [editReview, setEditReview] = useState(null)
  const [search, setSearch] = useState('')

  if (!apt) return <div style={{ padding: 40 }}>Apartment not found.</div>

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  function handleLogout() { logout(); navigate('/login') }

  function handleSubmitReview({ rating, body }) {
    const newReview = {
      id: `r-${Date.now()}`,
      aptId: apt.id,
      userId: user.id,
      userName: user.name,
      rating,
      body,
      date: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }),
    }
    setReviews(prev => [newReview, ...prev])
  }

  function handleEditReview({ rating, body }) {
    setReviews(prev => prev.map(r =>
      r.id === editReview.id ? { ...r, rating, body } : r
    ))
    setEditReview(null)
  }

  function handleDeleteReview(reviewId) {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : apt.rating.toFixed(1)

  // Rating breakdown counts
  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
  }))

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
          <span
            style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#2563eb' }}
            onClick={() => navigate('/profile')}
          >{user?.name}</span>
          <button onClick={handleLogout} style={styles.signOutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={styles.container}>
        <Link to="/dashboard" style={styles.backLink}>← Back to all apartments</Link>

        {/* Apartment Header */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.aptName}>{apt.name}</h1>
            <p style={styles.aptAddr}>📍 {apt.address} · {apt.neighbourhood}</p>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{apt.description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={styles.bigRating}>{avgRating}</div>
            <StarRating rating={parseFloat(avgRating)} />
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{reviews.length} reviews</div>
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {apt.aiSummary && <AISummary summary={apt.aiSummary} issues={apt.aiIssues} />}

            {/* Reviews section */}
            <div style={styles.reviewsHeader}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Reviews ({reviews.length})</h2>
              <button onClick={() => setShowReview(true)} style={styles.writeBtn}>+ Write a Review</button>
            </div>

            {reviews.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: 14 }}>No reviews yet. Be the first!</p>
            )}

            {reviews.map(r => (
              <ReviewCard
                key={r.id}
                rating={r.rating}
                body={r.body}
                date={r.date}
                author={r.userName}
                isOwner={r.userId === user?.id}
                onDelete={() => handleDeleteReview(r.id)}
                onEdit={() => setEditReview(r)}
              />
            ))}
          </div>

          {/* Right sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Property Info</h3>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Landlord</span><span style={styles.infoVal}>{apt.landlord}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Units</span><span style={styles.infoVal}>{apt.units}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Year built</span><span style={styles.infoVal}>{apt.yearBuilt}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Neighbourhood</span><span style={styles.infoVal}>{apt.neighbourhood}</span></div>
            </div>

            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Rating Breakdown</h3>
              {breakdown.map(({ star, count }) => (
                <div key={star} style={styles.breakdownRow}>
                  <span style={{ fontSize: 13, width: 10 }}>{star}</span>
                  <span style={{ fontSize: 13, color: '#f59e0b' }}>★</span>
                  <div style={styles.barBg}>
                    <div style={{
                      ...styles.barFill,
                      width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%'
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: '#6b7280', width: 14 }}>{count}</span>
                </div>
              ))}
              <button onClick={() => setShowReview(true)} style={styles.writeBtnFull}>Write a Review</button>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {showReview && (
        <ReviewDialog
          onClose={() => setShowReview(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* Edit Review Modal */}
      {editReview && (
        <ReviewDialog
          initial={editReview}
          onClose={() => setEditReview(null)}
          onSubmit={handleEditReview}
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
  container: { maxWidth: 1200, margin: '0 auto', padding: '28px 28px' },
  backLink: { color: '#2563eb', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 20 },
  headerCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  aptName: { fontSize: 28, fontWeight: 800, margin: '0 0 6px' },
  aptAddr: { fontSize: 14, color: '#6b7280', margin: '0 0 8px' },
  bigRating: { fontSize: 42, fontWeight: 800, color: '#2563eb', lineHeight: 1 },
  twoCol: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  reviewsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  writeBtn: { background: '#fff', border: '1.5px solid #2563eb', color: '#2563eb', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  writeBtnFull: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 16 },
  sidebar: { width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 },
  sideCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' },
  sideTitle: { fontSize: 15, fontWeight: 700, margin: '0 0 14px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 },
  infoLabel: { color: '#9ca3af' },
  infoVal: { fontWeight: 500, textAlign: 'right' },
  breakdownRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 },
  barBg: { flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', background: '#2563eb', borderRadius: 4, transition: 'width 0.3s' },
}
