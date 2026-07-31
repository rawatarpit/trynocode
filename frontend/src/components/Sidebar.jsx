import {
  IconDashboard,
  IconProjects,
  IconTasks,
  IconReports,
  IconSettings,
  IconChevronLeft,
  IconLogout,
} from './icons.jsx'
import { projects, tasks } from '../data.js'

// Badges stay in sync with the mock data instead of hardcoded counts.
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { id: 'projects', label: 'Projects', icon: IconProjects, badge: String(projects.length) },
  { id: 'tasks', label: 'Tasks', icon: IconTasks, badge: String(tasks.filter((t) => t.status !== 'Completed').length) },
  { id: 'reports', label: 'Reports', icon: IconReports },
]

export default function Sidebar({ current, collapsed, onNavigate, onToggle }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-mark" aria-hidden="true">E</div>
        <div className="logo-name">
          Elev<span>ate</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <div className="nav-section-label">Workspace</div>
        {NAV.map((item) => {
          const Icon = item.icon
          const active = current === item.id
          return (
            <button
              key={item.id}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          )
        })}

        <div className="nav-section-label">Administration</div>
        <button
          className={`nav-item ${current === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
          aria-current={current === 'settings' ? 'page' : undefined}
          title={collapsed ? 'Settings' : undefined}
        >
          <span className="nav-icon"><IconSettings /></span>
          <span className="nav-label">Settings</span>
        </button>
      </nav>

      <div className="sidebar-foot">
        <div className="user-card">
          <div className="avatar" title={collapsed ? 'A. Carter' : undefined}>AC</div>
          <div className="user-info">
            <div className="user-name">A. Carter</div>
            <div className="user-role">Procurement Admin</div>
          </div>
          <button className="user-logout" title="Sign out" aria-label="Sign out">
            <IconLogout width="16" height="16" />
          </button>
        </div>
        <button className="collapse-btn" onClick={onToggle} title="Collapse sidebar">
          <IconChevronLeft />
          <span className="collapse-label">Collapse</span>
        </button>
      </div>
    </aside>
  )
}
