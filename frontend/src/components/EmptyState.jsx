import { IconSearch } from './icons.jsx'

/*
 * Shared empty state — used by tables, cards, and full-page fallbacks so every
 * "nothing here" moment in the app looks and behaves the same.
 * - icon: icon component (defaults to search)
 * - title / message: copy
 * - actionLabel + actionIcon + onAction: optional CTA (e.g. "Clear filters")
 * - compact: reduce padding for card-embedded states
 */
export default function EmptyState({
  icon: Icon = IconSearch,
  title = 'Nothing here yet',
  message,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  compact = false,
  className = '',
}) {
  return (
    <div className={`empty-state ${compact ? 'empty-state-compact' : ''} ${className}`}>
      <div className="empty-illustration">
        <Icon width="24" height="24" aria-hidden="true" />
      </div>
      <h3 className="empty-title">{title}</h3>
      {message && <p className="empty-text">{message}</p>}
      {actionLabel && onAction && (
        <button type="button" className="btn btn-secondary" onClick={onAction}>
          {ActionIcon && <ActionIcon width="15" height="15" aria-hidden="true" />}
          {actionLabel}
        </button>
      )}
    </div>
  )
}
