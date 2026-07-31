import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Dropdown from '../components/Dropdown.jsx'
import FilterTabs from '../components/FilterTabs.jsx'
import FilterChips from '../components/FilterChips.jsx'
import { useToast } from '../components/Toast.jsx'
import { IconUser, IconPlus, IconBuilding, IconTag, IconGauge } from '../components/icons.jsx'
import { projects, projectDetails } from '../data.js'

const columns = [
  { key: 'name', label: 'Project Name', primary: true },
  { key: 'owner', label: 'Owner' },
  { key: 'supplier', label: 'Supplier', secondary: true },
  { key: 'progress', label: 'Progress', sortValue: (r) => r.progress ?? 0, render: (v) => (
    <div className="progress-cell">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${Math.min(v ?? 0, 100)}%` }} />
      </div>
      <span className="progress-pct">{v ?? 0}%</span>
    </div>
  )},
  { key: 'budget', label: 'Budget', align: 'right', sortValue: (r) => parseInt(String(r.budget).replace(/[^0-9]/g, ''), 10) || 0 },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
  { key: 'updated', label: 'Last Updated', muted: true },
]

const STATUS_OPTIONS = ['Approved', 'Pending', 'Submitted', 'Draft', 'Rejected', 'Completed']

// Status tab strip with live counts, derived from the project data.
const statusTabs = [
  { value: 'All', label: 'All', count: projects.length },
  ...STATUS_OPTIONS.map((s) => ({
    value: s,
    label: s,
    count: projects.filter((p) => p.status === s).length,
  })),
]

const OWNER_OPTIONS = [
  'A. Carter', 'S. Patel', 'M. Okafor', 'J. Reyes', 'L. Chen',
  'R. Gupta', 'T. Nguyen', 'P. Silva', 'K. Johnson', 'D. Kim',
]

// Pickers built from the live data so they never drift from the table.
const SUPPLIER_OPTIONS = [...new Set(projects.map((p) => p.supplier))].sort()
const CATEGORY_OPTIONS = [
  ...new Set(
    projects.map((p) => (projectDetails[p.name] || {}).category).filter(Boolean)
  ),
].sort()

const BUDGET_OPTIONS = [
  { value: 'any', label: 'Any budget' },
  { value: 'under100', label: 'Under $100K' },
  { value: '100-150', label: '$100K – $150K' },
  { value: '150-200', label: '$150K – $200K' },
  { value: 'over200', label: 'Over $200K' },
]

const parseBudget = (row) => parseInt(String(row.budget).replace(/[^0-9]/g, ''), 10) || 0

const budgetMatches = (row, range) => {
  const n = parseBudget(row)
  if (range === 'under100') return n < 100000
  if (range === '100-150') return n >= 100000 && n < 150000
  if (range === '150-200') return n >= 150000 && n < 200000
  if (range === 'over200') return n >= 200000
  return true
}

const SEARCH_FIELDS = ['name', 'owner', 'supplier']

// Merge rich detail data into each project row for the detail view.
const enriched = projects.map((p) => ({ ...p, details: projectDetails[p.name] || {} }))

export default function Projects({ onOpenProject }) {
  const [statusTab, setStatusTab] = useState('All')
  const [ownerFilter, setOwnerFilter] = useState('All owners')
  const [supplierFilter, setSupplierFilter] = useState('All suppliers')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [budgetFilter, setBudgetFilter] = useState('any')
  const [query, setQuery] = useState('')
  const toast = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return enriched.filter((row) => {
      if (statusTab !== 'All' && row.status !== statusTab) return false
      if (ownerFilter !== 'All owners' && row.owner !== ownerFilter) return false
      if (supplierFilter !== 'All suppliers' && row.supplier !== supplierFilter) return false
      if (categoryFilter !== 'All categories' && row.details.category !== categoryFilter) return false
      if (budgetFilter !== 'any' && !budgetMatches(row, budgetFilter)) return false
      if (q && !SEARCH_FIELDS.some((f) => String(row[f] || '').toLowerCase().includes(q))) return false
      return true
    })
  }, [statusTab, ownerFilter, supplierFilter, categoryFilter, budgetFilter, query])

  const chips = [
    ...(query.trim() ? [{ id: 'search', label: `Search: "${query.trim()}"` }] : []),
    ...(ownerFilter !== 'All owners' ? [{ id: 'owner', label: `Owner: ${ownerFilter}` }] : []),
    ...(supplierFilter !== 'All suppliers' ? [{ id: 'supplier', label: `Supplier: ${supplierFilter}` }] : []),
    ...(categoryFilter !== 'All categories' ? [{ id: 'category', label: `Category: ${categoryFilter}` }] : []),
    ...(budgetFilter !== 'any'
      ? [{ id: 'budget', label: `Budget: ${BUDGET_OPTIONS.find((o) => o.value === budgetFilter)?.label}` }]
      : []),
  ]
  const removeChip = (id) => {
    if (id === 'search') setQuery('')
    else if (id === 'owner') setOwnerFilter('All owners')
    else if (id === 'supplier') setSupplierFilter('All suppliers')
    else if (id === 'category') setCategoryFilter('All categories')
    else if (id === 'budget') setBudgetFilter('any')
  }
  const clearAll = () => {
    setStatusTab('All')
    setOwnerFilter('All owners')
    setSupplierFilter('All suppliers')
    setCategoryFilter('All categories')
    setBudgetFilter('any')
    setQuery('')
  }

  return (
    <>
      <PageHeader
        crumb="Procurement / Projects"
        title="Projects"
        subtitle="Manage and track procurement projects"
        actionLabel="New Project"
        actionIcon={IconPlus}
        onAction={() => toast.info('New project request created as a draft')}
        searchValue={query}
        onSearch={setQuery}
        filters={
          <>
            <FilterTabs
              tabs={statusTabs}
              value={statusTab}
              onChange={setStatusTab}
              label="Filter by status"
            />
            <Dropdown
              options={OWNER_OPTIONS}
              value={ownerFilter}
              onChange={setOwnerFilter}
              placeholder="All owners"
              icon={IconUser}
              searchable
            />
            <Dropdown
              options={SUPPLIER_OPTIONS}
              value={supplierFilter}
              onChange={setSupplierFilter}
              placeholder="All suppliers"
              icon={IconBuilding}
              searchable
            />
            <Dropdown
              options={CATEGORY_OPTIONS}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="All categories"
              icon={IconTag}
              searchable
            />
            <Dropdown
              options={BUDGET_OPTIONS}
              value={budgetFilter}
              onChange={setBudgetFilter}
              placeholder="Any budget"
              icon={IconGauge}
            />
          </>
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
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey="name"
          renderActions
          onRowClick={onOpenProject}
          onClearFilters={clearAll}
        />
        <div className="table-footer">
          <span>
            Showing {filtered.length} of {projects.length} projects
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </>
  )
}
