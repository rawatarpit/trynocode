import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import DataTable from '../components/DataTable.jsx'
import FilterTabs from '../components/FilterTabs.jsx'
import FilterChips from '../components/FilterChips.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useToast } from '../components/Toast.jsx'
import { IconFile, IconDownload, IconPlus } from '../components/icons.jsx'

const reports = [
  { name: 'Procurement Summary — July 2026', type: 'PDF', size: '2.4 MB', updated: 'Jul 30, 2026' },
  { name: 'Budget Utilization by Department', type: 'CSV', size: '180 KB', updated: 'Jul 28, 2026' },
  { name: 'Supplier Performance Scorecard', type: 'PDF', size: '1.1 MB', updated: 'Jul 25, 2026' },
  { name: 'Pending Approvals Aging Report', type: 'CSV', size: '96 KB', updated: 'Jul 23, 2026' },
]

// Type tab strip with live counts, derived from the report list.
const typeTabs = [
  { value: 'All', label: 'All', count: reports.length },
  ...['PDF', 'CSV'].map((t) => ({
    value: t,
    label: t,
    count: reports.filter((r) => r.type === t).length,
  })),
]

const columns = [
  {
    key: 'name',
    label: 'Report',
    primary: true,
    render: (v) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <IconFile width="15" height="15" style={{ color: 'var(--text-muted)' }} />
        {v}
      </span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    sortable: false,
    render: (v) => <span className="badge badge-neutral">{v}</span>,
  },
  { key: 'size', label: 'Size', align: 'right', muted: true },
  { key: 'updated', label: 'Updated', muted: true },
]

export default function Reports() {
  const [typeTab, setTypeTab] = useState('All')
  const [query, setQuery] = useState('')
  const toast = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reports.filter((row) => {
      if (typeTab !== 'All' && row.type !== typeTab) return false
      if (q && !row.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [typeTab, query])

  const chips = query.trim() ? [{ id: 'search', label: `Search: "${query.trim()}"` }] : []
  const removeChip = (id) => {
    if (id === 'search') setQuery('')
  }
  const clearAll = () => {
    setTypeTab('All')
    setQuery('')
  }

  return (
    <>
      <PageHeader
        crumb="Analytics / Reports"
        title="Reports"
        subtitle="Generated reports and exports"
        actionLabel="Generate Report"
        actionIcon={IconPlus}
        onAction={() => toast.info('Report generation started — we will email you when it is ready')}
        searchValue={query}
        onSearch={setQuery}
        filters={
          <FilterTabs
            tabs={typeTabs}
            value={typeTab}
            onChange={setTypeTab}
            label="Filter by type"
          />
        }
        chips={
          <FilterChips
            filters={chips}
            onRemove={removeChip}
            onClearAll={clearAll}
          />
        }
      />

      <div className="card table-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Available Reports</h3>
            <p className="card-subtitle">Download or regenerate recent exports</p>
          </div>
        </div>
        <DataTable
          columns={[
            ...columns,
            {
              key: 'download',
              label: 'Download',
              align: 'right',
              sortable: false,
              render: (_v, row) => (
                <button
                  className="btn btn-icon btn-sm"
                  aria-label={`Download ${row.name}`}
                  onClick={() => toast.info(`Downloading ${row.name}…`)}
                >
                  <IconDownload width="15" height="15" />
                </button>
              ),
            },
          ]}
          rows={filtered}
          rowKey="name"
          onClearFilters={clearAll}
        />
        <div className="table-footer">
          <span>
            Showing {filtered.length} of {reports.length} reports
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <EmptyState
            icon={IconFile}
            title="No scheduled reports yet"
            message="Set up a recurring report to receive procurement summaries automatically by email."
            actionLabel="Schedule a report"
            actionIcon={IconPlus}
            onAction={() => toast.info('Recurring report scheduled for the first of each month')}
            compact
          />
        </div>
      </div>
    </>
  )
}
