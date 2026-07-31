import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Dropdown from '../components/Dropdown.jsx'
import MultiSelect from '../components/MultiSelect.jsx'
import FilterTabs from '../components/FilterTabs.jsx'
import FilterField from '../components/FilterField.jsx'
import FilterChips from '../components/FilterChips.jsx'
import { useToast } from '../components/Toast.jsx'
import { IconFlag, IconUser, IconPlus, IconProjects } from '../components/icons.jsx'
import { tasks } from '../data.js'

function Priority({ value }) {
  const cls =
    value === 'High' ? 'priority-high' : value === 'Medium' ? 'priority-medium' : 'priority-low'
  return <span className={`priority ${cls}`}>{value}</span>
}

const columns = [
  { key: 'title', label: 'Task', primary: true },
  { key: 'assignee', label: 'Assignee' },
  { key: 'project', label: 'Project', secondary: true },
  { key: 'due', label: 'Due Date', muted: true, sortValue: (r) => new Date(r.due).getTime() },
  { key: 'priority', label: 'Priority', render: (v) => <Priority value={v} />, sortValue: (r) => ({ High: 0, Medium: 1, Low: 2 }[r.priority] ?? 3) },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
]

const STATUS_OPTIONS = ['Approved', 'Pending', 'Submitted', 'Draft', 'Rejected', 'Completed']
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']

// Status tab strip with live counts, derived from the task data.
const statusTabs = [
  { value: 'All', label: 'All', count: tasks.length },
  ...STATUS_OPTIONS.map((s) => ({
    value: s,
    label: s,
    count: tasks.filter((t) => t.status === s).length,
  })),
]

const ASSIGNEE_OPTIONS = [
  'A. Carter', 'S. Patel', 'M. Okafor', 'J. Reyes', 'L. Chen',
  'R. Gupta', 'T. Nguyen', 'P. Silva', 'K. Johnson', 'D. Kim',
]

const PROJECT_OPTIONS = [...new Set(tasks.map((t) => t.project))].sort()

const SEARCH_FIELDS = ['title', 'assignee', 'project']

export default function Tasks() {
  const [statusTab, setStatusTab] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState([])
  const [assigneeFilter, setAssigneeFilter] = useState('All assignees')
  const [projectFilter, setProjectFilter] = useState('All projects')
  const [query, setQuery] = useState('')
  const toast = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks.filter((row) => {
      if (statusTab !== 'All' && row.status !== statusTab) return false
      if (priorityFilter.length && !priorityFilter.includes(row.priority)) return false
      if (assigneeFilter !== 'All assignees' && row.assignee !== assigneeFilter) return false
      if (projectFilter !== 'All projects' && row.project !== projectFilter) return false
      if (q && !SEARCH_FIELDS.some((f) => String(row[f] || '').toLowerCase().includes(q))) return false
      return true
    })
  }, [statusTab, priorityFilter, assigneeFilter, projectFilter, query])

  const chips = [
    ...(query.trim() ? [{ id: 'search', label: `Search: "${query.trim()}"` }] : []),
    ...priorityFilter.map((p) => ({ id: `priority-${p}`, label: `Priority: ${p}` })),
    ...(assigneeFilter !== 'All assignees' ? [{ id: 'assignee', label: `Assignee: ${assigneeFilter}` }] : []),
    ...(projectFilter !== 'All projects' ? [{ id: 'project', label: `Project: ${projectFilter}` }] : []),
  ]
  const removeChip = (id) => {
    if (id === 'search') setQuery('')
    else if (id === 'assignee') setAssigneeFilter('All assignees')
    else if (id === 'project') setProjectFilter('All projects')
    else if (id.startsWith('priority-'))
      setPriorityFilter(priorityFilter.filter((p) => `priority-${p}` !== id))
  }
  const clearAll = () => {
    setStatusTab('All')
    setPriorityFilter([])
    setAssigneeFilter('All assignees')
    setProjectFilter('All projects')
    setQuery('')
  }

  return (
    <>
      <PageHeader
        crumb="Operations / Tasks"
        title="Tasks"
        subtitle="Track work across projects"
        actionLabel="New Task"
        actionIcon={IconPlus}
        onAction={() => toast.info('New task created as a draft')}
        searchValue={query}
        onSearch={setQuery}
        filters={
          <FilterTabs
            tabs={statusTabs}
            value={statusTab}
            onChange={setStatusTab}
            label="Filter by status"
          />
        }
        filterFields={
          <>
            <FilterField label="Priority">
              <MultiSelect
                label="Priority"
                placeholder="All priorities"
                options={PRIORITY_OPTIONS}
                value={priorityFilter}
                onChange={setPriorityFilter}
                icon={IconFlag}
              />
            </FilterField>
            <FilterField label="Assignee">
              <Dropdown
                options={ASSIGNEE_OPTIONS}
                value={assigneeFilter}
                onChange={setAssigneeFilter}
                placeholder="All assignees"
                icon={IconUser}
                searchable
              />
            </FilterField>
            <FilterField label="Project">
              <Dropdown
                options={PROJECT_OPTIONS}
                value={projectFilter}
                onChange={setProjectFilter}
                placeholder="All projects"
                icon={IconProjects}
                searchable
              />
            </FilterField>
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
          rowKey="title"
          renderActions
          onClearFilters={clearAll}
        />
        <div className="table-footer">
          <span>
            Showing {filtered.length} of {tasks.length} tasks
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </>
  )
}
