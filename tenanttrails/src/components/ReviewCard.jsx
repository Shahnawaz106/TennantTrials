import StarRating from './StarRating.jsx'

export default function ReviewCard({ rating, body, date, author, onDelete, onEdit, isOwner }) {
  const initials = author?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{author}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{date}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StarRating rating={rating} />
          {isOwner && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={onEdit} style={styles.editBtn}>Edit</button>
              <button onClick={onDelete} style={styles.deleteBtn}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <p style={styles.body}>{body}</p>
    </div>
  )
}

const styles = {
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px', marginBottom: 12 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 },
  body: { fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 },
  editBtn: { background: 'none', border: '1px solid #d1d5db', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: '#374151' },
  deleteBtn: { background: 'none', border: '1px solid #fca5a5', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: '#ef4444' },
}
