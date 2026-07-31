/*
 * Labeled wrapper for secondary filters in the page filter panel.
 * Gives every dropdown a small uppercase caption so a row of filters reads
 * like a designed form instead of a wall of bare triggers.
 */
export default function FilterField({ label, children }) {
  return (
    <div className="filter-field">
      <span className="filter-field-label">{label}</span>
      {children}
    </div>
  )
}
