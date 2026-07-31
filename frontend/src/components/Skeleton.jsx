export function Skeleton({ width, height = 16, radius, className = '', style }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height,
        borderRadius: radius || 'var(--radius)',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({ lines = 3, gap = 8, lastWidth = '60%' }) {
  return (
    <div className="skeleton-text" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={14}
          style={{
            width: i === lines - 1 ? lastWidth : '100%',
            marginBottom: i < lines - 1 ? gap : 0,
          }}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ style }) {
  return (
    <div className="skeleton-card" style={style} aria-hidden="true">
      <div className="skeleton-card-header">
        <Skeleton width={120} height={14} />
        <Skeleton width={48} height={20} radius="var(--radius-pill)" />
      </div>
      <Skeleton width={80} height={32} style={{ marginTop: 'var(--space-3)' }} />
      <SkeletonText lines={1} lastWidth="40%" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="skeleton-table" aria-hidden="true">
      <div className="skeleton-table-header">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} height={12} style={{ width: `${100 / cols}%` }} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="skeleton-table-row">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} height={14} style={{ width: c === 0 ? '30%' : `${Math.random() * 20 + 10}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}
