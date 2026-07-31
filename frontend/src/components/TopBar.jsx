import { useEffect, useRef, useState } from 'react'
import { IconSearch, IconBell, IconSun, IconMoon, IconMenu } from './icons.jsx'

const NOTIFS = [
  { id: 1, text: 'A. Carter approved ERP Platform Upgrade', time: '12 min ago', color: 'var(--success)' },
  { id: 2, text: 'Budget revision #3 opened for approval', time: '48 min ago', color: 'var(--warning)' },
  { id: 3, text: 'Task "Finalize relocation quote" was rejected', time: '3 hr ago', color: 'var(--error)' },
]

export default function TopBar({ theme, onToggleTheme, onOpenPalette, onToggleSidebar }) {
  const notifRef = useRef(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unread, setUnread] = useState(NOTIFS.length)

  // Click outside closes notifications.
  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <IconMenu width="20" height="20" />
        </button>
        <span className="topbar-dot" aria-hidden="true" />
        <span className="topbar-org">Elevate Corp</span>
        <span className="topbar-env">Prod</span>
      </div>

      <div className="topbar-right">
        <button
          className="topbar-search-trigger"
          onClick={onOpenPalette}
          aria-label="Open command palette (⌘K)"
        >
          <IconSearch />
          <span>Search…</span>
          <kbd className="kbd" aria-hidden="true">⌘K</kbd>
        </button>

        <button
          className="topbar-icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <IconSun width="17" height="17" /> : <IconMoon width="17" height="17" />}
        </button>

        <div className="notif-wrap" ref={notifRef}>
          <button
            className={`topbar-icon-btn ${notifOpen ? 'open' : ''}`}
            aria-label={`Notifications (${unread} unread)`}
            aria-haspopup="menu"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
          >
            <IconBell width="18" height="18" />
            {unread > 0 && <span className="notify-dot" aria-hidden="true" />}
          </button>

          {notifOpen && (
            <div className="notif-menu" role="menu" aria-label="Notifications">
              <div className="notif-header">
                <span>Notifications</span>
                <button
                  type="button"
                  className="notif-mark-read"
                  onClick={() => setUnread(0)}
                  disabled={unread === 0}
                >
                  Mark all read
                </button>
              </div>
              {NOTIFS.map((n) => (
                <div key={n.id} className="notif-item" role="menuitem">
                  <span className="notif-dot" style={{ background: n.color }} aria-hidden="true" />
                  <div>
                    <div className="notif-text">{n.text}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
              <div className="notif-footer">
                <button type="button" onClick={() => setNotifOpen(false)}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="topbar-divider" aria-hidden="true" />

        <button className="topbar-profile" aria-label="Open profile menu">
          <span className="avatar avatar-sm">AC</span>
          <span className="topbar-profile-name">A. Carter</span>
        </button>
      </div>
    </header>
  )
}
