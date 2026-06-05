import { useState } from 'react'

export default function ReviewDialog({ onClose, onSubmit, initial }) {
  const [rating, setRating] = useState(initial?.rating || 0)
  const [hovered, setHovered] = useState(0)
  const [body, setBody] = useState(initial?.body || '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (rating === 0) { setError('Please select a star rating.'); return }
    if (!body.trim()) { setError('Please write your review.'); return }
    onSubmit({ rating, body })
    onClose()
  }

  const isEdit = !!initial

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.title}>{isEdit ? 'Edit Review' : 'Write a Review'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Your rating</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                style={{ fontSize: 28, cursor: 'pointer', color: n <= (hovered || rating) ? '#f59e0b' : '#d1d5db' }}
              >
                ★
              </span>
            ))}
          </div>
          {rating > 0 && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{rating} of 5</div>}
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Your review</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What was your experience living here? Cover maintenance, responsiveness, noise, pests, deposit handling, and anything future tenants should know."
            style={styles.textarea}
          />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={styles.submitBtn}>
            {isEdit ? 'Save Changes' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 500, color: '#374151' },
  textarea: { width: '100%', minHeight: 120, padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', marginTop: 6, boxSizing: 'border-box', fontFamily: 'inherit' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { background: 'none', border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' },
  submitBtn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
}
