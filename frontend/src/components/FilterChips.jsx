import { IconX } from './icons.jsx'

// Active filter chips row: [Active filters] [Status: Approved ×] [Owner: A. Carter ×] [Clear all]
export default function FilterChips({ filters = [], onRemove, onClearAll }) {
  if (filters.length === 0) return null

  return (
    <div className="filter-chips" role="group" aria-label="Active filters">
      <span className="filter-chips-label">Active filters</span>
      {filters.map((f) => (
        <span key={f.id} className="chip">
          {f.label}
          <button
            type="button"
            className="chip-remove"
            onClick={() => onRemove(f.id)}
            aria-label={`Remove filter ${f.label}`}
          >
            <IconX width="12" height="12" />
          </button>
        </span>
      ))}
      <button type="button" className="chip-clear-all" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  )
}
