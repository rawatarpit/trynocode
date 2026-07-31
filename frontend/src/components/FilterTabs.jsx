// Tab-style single-select filter strip, e.g. All (7) · Pending (3) · Approved (2).
// Sits above tables in toolbars; the active option replaces the old
// multi-select status dropdown — the selected state is visible at a glance.
export default function FilterTabs({ tabs = [], value, onChange, label = 'Filters' }) {
  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            type="button"
            className={`filter-tab ${active ? 'active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(t.value)}
          >
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="filter-tab-count" aria-hidden="true">{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
