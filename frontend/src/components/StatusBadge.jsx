// One status → one semantic color. Centralized mapping.
const STATUS_TONE = {
  Draft: 'neutral',
  Pending: 'warning',
  Submitted: 'info',
  Approved: 'success',
  Completed: 'success',
  Rejected: 'error',
  Overdue: 'error',
  Archived: 'neutral',
  Inactive: 'neutral',
}

export default function StatusBadge({ status }) {
  const tone = STATUS_TONE[status] || 'neutral'
  return <span className={`badge badge-${tone}`}>{status}</span>
}
