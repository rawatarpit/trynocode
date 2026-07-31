import { IconArrowRight } from './icons.jsx'

// Dense single-row "what needs me" bar. Three inline segments (icon · label ·
// count), hairline-separated, each deep-linking into the app. Not a hero, not
// a list — a navigation strip. Shows an "all clear" state when nothing is due.
export default function AttentionBar({ stats = [], onNavigate }) {
  const total = stats.reduce((sum, s) => sum + s.count, 0)

  if (total === 0) {
    return (
      <section className="attention-bar" aria-label="Needs your attention">
        <span className="attention-bar-empty">
          Nothing needs your attention right now — you're all caught up.
        </span>
      </section>
    )
  }

  return (
    <section className="attention-bar" aria-label="Needs your attention">
      <span className="attention-bar-label">Needs attention</span>
      <div className="attention-bar-segments">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <button
              key={stat.id}
              type="button"
              className="attention-segment"
              style={{ '--seg-accent': stat.accent }}
              onClick={() => onNavigate(stat.to)}
              title={stat.context}
              aria-label={`${stat.label}: ${stat.count} — ${stat.context}`}
            >
              <span className="attention-segment-icon">
                <Icon width="15" height="15" aria-hidden="true" />
              </span>
              <span className="attention-segment-label">{stat.label}</span>
              <span className="attention-segment-count">{stat.count}</span>
              <IconArrowRight
                className="attention-segment-arrow"
                width="14"
                height="14"
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
