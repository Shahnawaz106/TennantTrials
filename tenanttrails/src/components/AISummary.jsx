export default function AISummary({ summary, issues }) {
  return (
    <div style={styles.box}>
      <div style={styles.label}>✦ AI-GENERATED SUMMARY</div>
      <p style={styles.text}>{summary}</p>
      {issues && issues.length > 0 && (
        <>
          <div style={styles.issuesTitle}>Key Issues</div>
          <div style={styles.tags}>
            {issues.map(issue => (
              <span key={issue} style={styles.tag}>{issue}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  box: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '20px 24px', marginBottom: 24 },
  label: { fontSize: 11, fontWeight: 700, color: '#0284c7', letterSpacing: 1, marginBottom: 10 },
  text: { fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 16px' },
  issuesTitle: { fontSize: 14, fontWeight: 600, marginBottom: 8 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: { background: '#fff', border: '1px solid #bae6fd', borderRadius: 20, padding: '4px 12px', fontSize: 13, color: '#0369a1' },
}
