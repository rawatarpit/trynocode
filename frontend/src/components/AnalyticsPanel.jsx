import { useState } from 'react'

/* ---------- Spend: gradient area chart with hover tooltip ---------- */
export function SpendPanel({ data }) {
  const [hover, setHover] = useState(null)
  const w = 300
  const h = 130
  const pad = 10
  const max = Math.max(...data.map((d) => d.value)) * 1.15

  const pts = data.map((d, i) => ({
    ...d,
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - (d.value / max) * (h - pad * 2),
  }))

  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  const area = `${line} L${last.x.toFixed(1)},${h - pad} L${pts[0].x.toFixed(1)},${h - pad} Z`

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Monthly Spend</h3>
          <p className="card-subtitle">Procurement commitment by month ($K)</p>
        </div>
        <span className="stat-chip">Total $433K</span>
      </div>
      <div className="card-body">
        <div className="chart-wrap">
          <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Monthly spend trend">
            <defs>
              <linearGradient id="spend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.26" />
                <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1={pad}
                x2={w - pad}
                y1={pad + f * (h - pad * 2)}
                y2={pad + f * (h - pad * 2)}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            ))}
            <path d={area} fill="url(#spend-fill)" />
            <path
              d={line}
              fill="none"
              stroke="var(--brand-500)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {pts.map((p) => (
              <circle
                key={p.label}
                cx={p.x}
                cy={p.y}
                r={hover === p.label ? 5 : 3}
                fill={hover === p.label ? 'var(--brand-600)' : 'var(--surface)'}
                stroke="var(--brand-500)"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'r 0.12s ease' }}
                onMouseEnter={() => setHover(p.label)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
            {hover && (() => {
              const p = pts.find((d) => d.label === hover)
              return (
                <g>
                  <line x1={p.x} x2={p.x} y1={p.y - 8} y2={h - pad} stroke="var(--brand-300)" strokeWidth="1" strokeDasharray="2 3" />
                  <rect
                    x={Math.min(Math.max(p.x - 26, 2), w - 56)}
                    y={p.y - 30}
                    width="52"
                    height="20"
                    rx="6"
                    fill="var(--text)"
                  />
                  <text
                    x={Math.min(Math.max(p.x - 26, 2), w - 56) + 26}
                    y={p.y - 16}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="600"
                    fill="#fff"
                  >
                    ${p.value}K
                  </text>
                </g>
              )
            })()}
          </svg>
          <div className="chart-labels">
            {data.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Donut with center total + clean legend ---------- */
export function DonutPanel({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const size = 140
  const r = 48
  const c = 2 * Math.PI * r
  const gap = 2.5 // visual gap between segments
  let acc = 0
  const segments = data.map((d) => {
    const frac = d.value / total
    const seg = { ...d, frac, dash: Math.max(frac * c - gap, 1.5), offset: -acc * c }
    acc += frac
    return seg
  })

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Requests by Status</h3>
          <p className="card-subtitle">Share by current status</p>
        </div>
      </div>
      <div className="card-body">
        <div className="donut-wrap">
          <div className="donut-chart">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="var(--surface-subtle)"
                strokeWidth="15"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeDasharray={`${seg.dash} ${c - seg.dash}`}
                  strokeDashoffset={seg.offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              ))}
            </svg>
            <div className="donut-center">
              <div className="donut-center-value">{total}</div>
              <div className="donut-center-label">requests</div>
            </div>
          </div>
          <div className="donut-legend">
            {segments.map((seg) => (
              <div key={seg.label} className="donut-legend-item">
                <span className="donut-legend-dot" style={{ background: seg.color }} />
                <span className="legend-label">{seg.label}</span>
                <span className="legend-pct">{Math.round(seg.frac * 100)}%</span>
                <span className="legend-value">{seg.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Activity timeline ---------- */
export function ActivityPanel({ items }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Activity</h3>
          <p className="card-subtitle">What changed in the last 24 hours</p>
        </div>
      </div>
      <div className="card-body">
        <div className="activity-list">
          {items.map((item, i) => (
            <div key={item.id} className="activity-item">
              <div className="activity-marker">
                <span className="activity-dot" style={{ background: item.color }} />
                {i < items.length - 1 && <span className="activity-line" aria-hidden="true" />}
              </div>
              <div className="activity-body">
                <div className="activity-text">{item.text}</div>
                <div className="activity-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
