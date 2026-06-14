// Skeleton fallback shown while a lazy page chunk loads.
// Uses the same classes as the inline pre-React skeleton in index.html for a seamless handoff.
export default function Skeleton() {
  return (
    <div className="app-skeleton" role="status" aria-label="Loading">
      <div className="sk-header">
        <div className="sk-logo sk-shimmer" />
        <div className="sk-actions">
          <div className="sk-pill sk-shimmer" />
          <div className="sk-dot sk-shimmer" />
        </div>
      </div>
      <div className="sk-hero">
        <div className="sk-line sk-shimmer" style={{ width: '62%' }} />
        <div className="sk-line sk-shimmer" style={{ width: '48%' }} />
        <div className="sk-line sk-sm sk-shimmer" style={{ width: '38%' }} />
        <div className="sk-btn sk-shimmer" />
      </div>
    </div>
  )
}
