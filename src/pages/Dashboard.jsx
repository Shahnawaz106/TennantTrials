import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_APARTMENTS, NEIGHBOURHOODS, SORT_OPTIONS } from '../data/mockData.js'

function Stars({ rating }) {
  return (
    <span style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  )
}

function ApartmentCard({ apt }) {
  return (
    <div style={styles.card}>
      <div style={{ position: 'relative' }}>
        <img src={apt.image} alt={apt.name} style={styles.cardImg}
          onError={e => { e.target.style.background = '#e5e7eb'; e.target.src = '' }} />
        <div style={styles.ratingBadge}>
          <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
          <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 2 }}>{apt.rating.toFixed(1)}</span>
        </div>
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{apt.name}</h3>
        <p style={styles.cardAddr}>📍 {apt.address} · {apt.neighbourhood}</p>
        <div style={styles.tags}>
          {apt.tags.map(t => <span key={t} style={styles.tag}>{t}</span>)}
        </div>
        <div style={styles.cardFooter}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{apt.reviews} {apt.reviews === 1 ? 'review' : 'reviews'}</span>
          <Stars rating={apt.rating} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('All Neighbourhoods')
  const [sort, setSort] = useState('Highest Rated')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = MOCK_APARTMENTS
    .filter(a => {
      const q = search.toLowerCase()
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.address.toLowerCase().includes(q) || a.neighbourhood.toLowerCase().includes(q)
      const matchNeighbourhood = neighbourhood === 'All Neighbourhoods' || a.neighbourhood === neighbourhood
      return matchSearch && matchNeighbourhood
    })
    .sort((a, b) => {
      if (sort === 'Highest Rated') return b.rating - a.rating
      if (sort === 'Lowest Rated') return a.rating - b.rating
      if (sort === 'Most Reviews') return b.reviews - a.reviews
      return 0
    })

  // useEffect: update the browser tab title whenever the filtered count changes.
  // Dependency array [filtered.length] means this runs only when that value changes.
  // The cleanup function resets the title when the component unmounts.
  useEffect(() => {
    document.title = `TenantTrails — ${filtered.length} apartments`
    return () => {
      document.title = 'TenantTrails'
    }
  }, [filtered.length])

  function handleLogout() { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const totalReviews = MOCK_APARTMENTS.reduce((s, a) => s + a.reviews, 0)
  const uniqueNeighbourhoods = [...new Set(MOCK_APARTMENTS.map(a => a.neighbourhood))].length

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <nav style={styles.navbar}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span style={styles.navBrand}>TenantTrails</span>
    <div style={{ position: 'relative' }}>
      <span style={styles.searchIcon}>🔍</span>
      <input type="text" placeholder="Search apartments by address or neighbourhood..."
        value={search} onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
    </div>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={styles.avatar}>{initials}</div>
    <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
    <button onClick={handleLogout} style={styles.signOutBtn}>Sign out</button>
  </div>
</nav>

      <div style={styles.container}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Apartments in Halifax</h1>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>Honest reviews from real tenants. Read before you rent.</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <span style={styles.statPill}>{MOCK_APARTMENTS.length} apartments</span>
          <span style={styles.statPill}>{totalReviews} reviews</span>
          <span style={styles.statPill}>{uniqueNeighbourhoods} neighbourhoods</span>
        </div>

        {/* Conditional rendering: toggle button shows/hides the filter dropdowns */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={styles.filterToggleBtn}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <select value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)} style={styles.select}>
              {NEIGHBOURHOODS.map(n => <option key={n}>{n}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} style={styles.select}>
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}

        {filtered.length === 0
          ? <p style={{ color: '#6b7280', textAlign: 'center', marginTop: 60 }}>No apartments match your search.</p>
          : <div style={styles.grid}>{filtered.map(apt => <ApartmentCard key={apt.id} apt={apt} />)}</div>
        }
      </div>
    </div>
  )
}

const styles = {
  navbar: { background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 56, position: 'sticky', top: 0, zIndex: 10 },
  navBrand: { fontSize: 18, fontWeight: 700, color: '#2563eb' },
  searchIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 },
  searchInput: { paddingLeft: 32, paddingRight: 14, paddingTop: 8, paddingBottom: 8, border: '1.5px solid #d1d5db', borderRadius: 20, fontSize: 13, width: 500, background: '#f9fafb' },  avatar: { width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 },
  signOutBtn: { background: 'none', border: 'none', fontSize: 14, color: '#6b7280', cursor: 'pointer' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 28px' },
  statPill: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 500, color: '#374151' },
  filterToggleBtn: { background: 'none', border: '1.5px solid #d1d5db', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', marginBottom: 12, color: '#374151' },
  select: { padding: '8px 14px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' },
  cardImg: { width: '100%', height: 170, objectFit: 'cover', display: 'block', background: '#e5e7eb' },
  ratingBadge: { position: 'absolute', top: 10, right: 10, background: '#fff', borderRadius: 20, padding: '3px 10px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  cardBody: { padding: '14px 16px 16px' },
  cardTitle: { fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#111827' },
  cardAddr: { fontSize: 13, color: '#6b7280', margin: '0 0 10px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#374151' },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
}
