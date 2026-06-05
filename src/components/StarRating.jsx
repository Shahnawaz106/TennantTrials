export default function StarRating({ rating, max = 5 }) {
  const full = Math.round(rating)
  return (
    <span style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ fontSize: 16, color: '#f59e0b' }}>
          {i < full ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}
