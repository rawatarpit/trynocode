import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import PageHeader from '../components/PageHeader.jsx'
import FilterTabs from '../components/FilterTabs.jsx'
import FilterChips from '../components/FilterChips.jsx'
import Dropdown from '../components/Dropdown.jsx'
import AttentionBar from '../components/AttentionBar.jsx'
import { SpendPanel, DonutPanel, ActivityPanel } from '../components/AnalyticsPanel.jsx'
import {
  IconPlus,
  IconArrowRight,
  IconShield,
  IconCheck,
  IconFileText,
  IconSearch,
  IconX,
  IconBuilding,
  IconUser,
} from '../components/icons.jsx'
import { projectRequests, tasks, analytics } from '../data.js'

const columns = [
  { key: 'id', label: 'Request', muted: true },
  { key: 'name', label: 'Project Name', primary: true },
  { key: 'budget', label: 'Budget', align: 'right', sortValue: (r) => parseInt(String(r.budget).replace(/[^0-9]/g, ''), 10) || 0 },
  { key: 'supplier', label: 'Supplier', secondary: true },
  { key: 'buyer', label: 'Buyer' },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
  { key: 'date', label: 'Date', muted: true },
]

const STATUS_OPTIONS = ['Approved', 'Pending', 'Submitted', 'Draft', 'Rejected', 'Completed']

// Status tab strip with live counts, derived from the request data.
const statusTabs = [
  { value: 'All', label: 'All', count: projectRequests.length },
  ...STATUS_OPTIONS.map((s) => ({
    value: s,
    label: s,
    count: projectRequests.filter((r) => r.status === s).length,
  })),
]

const SEARCH_FIELDS = ['id', 'name', 'supplier', 'buyer']

// Pickers built from the live request data so they never drift from the table.
const SUPPLIER_OPTIONS = [...new Set(projectRequests.map((r) => r.supplier))].sort()
const BUYER_OPTIONS = [...new Set(projectRequests.map((r) => r.buyer))].sort()

// ---- Attention bar data, derived from live mock data ----
const inReview = projectRequests.filter((r) => r.status === 'Pending' || r.status === 'Submitted')
const openTasks = tasks.filter((t) => t.status !== 'Completed')
const highPriorityTasks = openTasks.filter((t) => t.priority === 'High')
const drafts = projectRequests.filter((r) => r.status === 'Draft')

const attentionStats = [
  {
    id: 'review',
    count: inReview.length,
    label: 'Awaiting review',
    context: inReview.length ? `${inReview.map((r) => r.id).join(' · ')} in review` : 'Nothing waiting',
    accent: 'var(--warning)',
    icon: IconShield,
    to: 'projects',
  },
  {
    id: 'tasks',
    count: openTasks.length,
    label: 'Open tasks',
    context: highPriorityTasks.length
      ? `${highPriorityTasks.length} high priority`
      : 'No open priorities',
    accent: 'var(--brand-500)',
    icon: IconCheck,
    to: 'tasks',
  },
  {
    id: 'drafts',
    count: drafts.length,
    label: 'Draft requests',
    context: drafts.length ? `${drafts.map((r) => r.id).join(' · ')} in draft` : 'Nothing in draft',
    accent: 'var(--accent-violet)',
    icon: IconFileText,
    to: 'projects',
  },
]

export default function Dashboard({ onNavigate }) {
  const [statusTab, setStatusTab] = useState('All')
  const [supplierFilter, setSupplierFilter] = useState('All suppliers')
  const [buyerFilter, setBuyerFilter] = useState('All buyers')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projectRequests.filter((row) => {
      if (statusTab !== 'All' && row.status !== statusTab) return false
      if (supplierFilter !== 'All suppliers' && row.supplier !== supplierFilter) return false
      if (buyerFilter !== 'All buyers' && row.buyer !== buyerFilter) return false
      if (q && !SEARCH_FIELDS.some((f) => String(row[f] || '').toLowerCase().includes(q))) return false
      return true
    })
  }, [statusTab, supplierFilter, buyerFilter, query])

  const chips = [
    ...(query.trim() ? [{ id: 'search', label: `Search: "${query.trim()}"` }] : []),
    ...(supplierFilter !== 'All suppliers' ? [{ id: 'supplier', label: `Supplier: ${supplierFilter}` }] : []),
    ...(buyerFilter !== 'All buyers' ? [{ id: 'buyer', label: `Buyer: ${buyerFilter}` }] : []),
  ]
  const removeChip = (id) => {
    if (id === 'search') setQuery('')
    else if (id === 'supplier') setSupplierFilter('All suppliers')
    else if (id === 'buyer') setBuyerFilter('All buyers')
  }
  const clearAll = () => {
    setStatusTab('All')
    setSupplierFilter('All suppliers')
    setBuyerFilter('All buyers')
    setQuery('')
  }

  return (
    <>
      <PageHeader
        crumb="Procurement / Overview"
        title="Dashboard"
        subtitle="Overview of procurement activity"
        actionLabel="New Project Request"
        actionIcon={IconPlus}
        onAction={() => onNavigate('projects')}
      />

      <AttentionBar stats={attentionStats} onNavigate={onNavigate} />

      <div className="analytics-grid">
        <SpendPanel data={analytics.spend} />
        <DonutPanel data={analytics.statusDistribution} />
        <ActivityPanel items={analytics.activity} />
      </div>

      <div className="card table-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Project Requests</h3>
            <p className="card-subtitle">Newest requests across the organization</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('projects')}>
            View all
            <IconArrowRight width="14" height="14" aria-hidden="true" />
          </button>
        </div>
        <div className="table-toolbar">
          <div className="search-field">
            <IconSearch />
            <input
              className="input"
              type="search"
              placeholder="Search requests…"
              aria-label="Search requests"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <IconX width="12" height="12" />
              </button>
            )}
          </div>
          <div className="table-toolbar-spacer" />
          <Dropdown
            options={SUPPLIER_OPTIONS}
            value={supplierFilter}
            onChange={setSupplierFilter}
            placeholder="All suppliers"
            icon={IconBuilding}
            searchable
          />
          <Dropdown
            options={BUYER_OPTIONS}
            value={buyerFilter}
            onChange={setBuyerFilter}
            placeholder="All buyers"
            icon={IconUser}
            searchable
          />
          <FilterTabs
            tabs={statusTabs}
            value={statusTab}
            onChange={setStatusTab}
            label="Filter by status"
          />
        </div>
        {chips.length > 0 && (
          <div className="table-filter-bar">
            <FilterChips
              filters={chips}
              onRemove={removeChip}
              onClearAll={clearAll}
            />
          </div>
        )}
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey="id"
          renderActions
          onClearFilters={clearAll}
        />
        <div className="table-footer">
          <span>
            Showing {filtered.length} of {projectRequests.length} requests
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </>
  )
}
