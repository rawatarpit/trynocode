import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconDashboard,
  IconProjects,
  IconTasks,
  IconReports,
  IconSettings,
  IconSearch,
  IconPlus,
  IconSun,
  IconMoon,
  IconZap,
} from './icons.jsx'
import { projects, tasks } from '../data.js'

const NAV_ITEMS = [
  { id: 'nav-dashboard', group: 'Navigate', label: 'Dashboard', sub: 'Procurement overview', icon: IconDashboard, keywords: 'home overview kpi', run: 'dashboard' },
  { id: 'nav-projects',  group: 'Navigate', label: 'Projects',  sub: 'Manage projects',     icon: IconProjects,  keywords: 'project pipeline',     run: 'projects' },
  { id: 'nav-tasks',     group: 'Navigate', label: 'Tasks',     sub: 'Track work',           icon: IconTasks,     keywords: 'todo assignee',        run: 'tasks' },
  { id: 'nav-reports',   group: 'Navigate', label: 'Reports',   sub: 'Exports & analytics',  icon: IconReports,   keywords: 'export analytics',     run: 'reports' },
  { id: 'nav-settings',  group: 'Navigate', label: 'Settings',  sub: 'Workspace config',     icon: IconSettings,  keywords: 'admin config',         run: 'settings' },
]

const PROJECT_ENTITIES = projects.map((p) => ({
  id: 'ent-p-' + p.name, group: 'Projects', label: p.name, sub: p.owner,
  icon: IconProjects, keywords: 'project', run: 'projects',
}))

const TASK_ENTITIES = tasks.map((t) => ({
  id: 'ent-t-' + t.title, group: 'Tasks', label: t.title, sub: t.project,
  icon: IconTasks, keywords: 'task', run: 'tasks',
}))

function score(q, text) {
  if (!q) return 0
  const t = text.toLowerCase()
  const n = q.toLowerCase()
  if (t === n) return 3
  if (t.startsWith(n)) return 2
  if (t.includes(n)) return 1
  return -1
}

function getRecent() {
  try { return JSON.parse(localStorage.getItem('ep-palette-recent') || '[]') } catch { return [] }
}

function addRecent(id) {
  const rec = getRecent().filter((r) => r !== id)
  rec.unshift(id)
  localStorage.setItem('ep-palette-recent', JSON.stringify(rec.slice(0, 4)))
}

export default function CommandPalette({ open, onClose, onNavigate, theme, onToggleTheme }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const actions = useMemo(() => [
    { id: 'act-theme', group: 'Actions', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: theme === 'dark' ? IconSun : IconMoon, keywords: 'theme dark light appearance', action: onToggleTheme },
    { id: 'act-new-project', group: 'Actions', label: 'New project request', icon: IconPlus, keywords: 'create add request', run: 'projects' },
    { id: 'act-new-task', group: 'Actions', label: 'New task', icon: IconPlus, keywords: 'create add todo', run: 'tasks' },
    { id: 'act-report', group: 'Actions', label: 'Generate report', icon: IconPlus, keywords: 'export pdf csv', run: 'reports' },
  ], [theme, onToggleTheme])

  const all = useMemo(() => [...NAV_ITEMS, ...actions, ...PROJECT_ENTITIES, ...TASK_ENTITIES], [actions])

  // Filter + group results
  const { groups, flat } = useMemo(() => {
    const q = query.trim()
    if (!q) {
      const recent = getRecent().map((id) => all.find((c) => c.id === id)).filter(Boolean)
      const g = []
      if (recent.length) g.push({ label: 'Recent', items: recent })
      g.push({ label: 'Navigate', items: NAV_ITEMS })
      g.push({ label: 'Actions', items: actions })
      g.push({ label: 'Projects', items: PROJECT_ENTITIES.slice(0, 5) })
      return { groups: g, flat: g.flatMap((g) => g.items) }
    }
    const scored = all
      .map((c) => ({ c, s: Math.max(score(q, c.label), score(q, (c.keywords || '') + ' ' + (c.sub || ''))) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.c)
    // regroup preserving group order
    const seen = new Map()
    for (const item of scored) {
      const key = item.group
      if (!seen.has(key)) seen.set(key, [])
      seen.get(key).push(item)
    }
    const order = ['Navigate', 'Actions', 'Projects', 'Tasks']
    const g = order.filter((k) => seen.has(k)).map((k) => ({ label: k, items: seen.get(k) }))
    return { groups: g, flat: scored }
  }, [query, all, actions])

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Focus restore on close
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    return () => prev?.focus?.()
  }, [open])

  const execute = (item) => {
    if (item.action) item.action()
    else if (item.run) {
      addRecent(item.id)
      onNavigate(item.run)
    }
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) execute(flat[active])
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div className="palette-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="palette" role="dialog" aria-label="Command palette">
        <div className="palette-input-row">
          <IconSearch />
          <input
            ref={inputRef}
            className="palette-input"
            type="text"
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            aria-label="Search commands"
          />
          <button className="palette-esc" onClick={onClose} aria-label="Close palette">esc</button>
        </div>

        <div className="palette-results" ref={listRef}>
          {flat.length === 0 && query && (
            <div className="palette-empty">
              No results for "<strong>{query}</strong>"
            </div>
          )}
          {groups.map((g) => (
            <div key={g.label}>
              <div className="palette-group-label">{g.label}</div>
              {g.items.map((item) => {
                const Icon = item.icon
                const idx = flat.indexOf(item)
                const isActive = idx === active
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`palette-item ${isActive ? 'active' : ''}`}
                    data-active={isActive || undefined}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => execute(item)}
                  >
                    <span className="palette-item-icon"><Icon width="15" height="15" /></span>
                    <span className="palette-item-label">{item.label}</span>
                    {item.sub && <span className="palette-item-sub">{item.sub}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
