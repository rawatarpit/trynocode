import { IconSearch, IconX } from './icons.jsx'
import FilterChips from './FilterChips.jsx'

// Page title + primary CTA, then the toolbar.
// Toolbar layout: [ search ] ... [ divider | filters ] [ divider | actions ]
// Optional secondary filter panel (labeled fields) renders under the toolbar.
export default function PageHeader({
  crumb,
  title,
  subtitle,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  filters,
  filterFields,
  actions,
  chips,
  searchValue = '',
  onSearch,
}) {
  return (
    <header className="page-header">
      <div className="page-header-top">
        <div>
          {crumb && <p className="crumb">{crumb}</p>}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actionLabel && (
          <button className="btn btn-primary" onClick={onAction}>
            {ActionIcon && <ActionIcon width="15" height="15" aria-hidden="true" />}
            {actionLabel}
          </button>
        )}
      </div>

      <div className="toolbar">
        {onSearch && (
          <div className="search-field">
            <IconSearch />
            <input
              className="input"
              type="search"
              placeholder="Search…"
              aria-label="Search"
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
            />
            {searchValue && (
              <button
                className="search-clear"
                onClick={() => onSearch?.('')}
                aria-label="Clear search"
              >
                <IconX width="12" height="12" />
              </button>
            )}
          </div>
        )}
        <div className="toolbar-spacer" />
        {filters && (
          <>
            <div className="toolbar-divider" aria-hidden="true" />
            <div className="filter-group">{filters}</div>
          </>
        )}
        {actions && (
          <>
            <div className="toolbar-divider" aria-hidden="true" />
            <div className="toolbar-actions">{actions}</div>
          </>
        )}
      </div>

      {filterFields && <div className="filter-panel">{filterFields}</div>}

      {chips}
    </header>
  )
}
