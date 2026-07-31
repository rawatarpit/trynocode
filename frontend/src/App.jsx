import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import { ToastProvider } from './components/Toast.jsx'
import PageTransition from './components/PageTransition.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Tasks from './pages/Tasks.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import { projects } from './data.js'

function getInitialTheme() {
  const stored = localStorage.getItem('ep-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openProject, setOpenProject] = useState(null)

  const navigate = (id) => {
    setPage(id)
    setOpenProject(null)
    setSidebarOpen(false) // Close mobile sidebar on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openProjectDetail = (project) => {
    setPage('projects')
    setOpenProject(project)
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }

  const closeProjectDetail = () => {
    setOpenProject(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSidebar = () => setSidebarOpen((o) => !o)

  // Apply theme to <html> and persist.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ep-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0b1120' : '#f5f6fa',
    )
  }, [theme])

  // Global ⌘K / Ctrl+K opens command palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <ToastProvider>
      <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile overlay */}
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <Sidebar
          current={page}
          collapsed={collapsed}
          onNavigate={navigate}
          onToggle={() => setCollapsed((c) => !c)}
        />

        <main className="app-main">
          <TopBar
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            onOpenPalette={() => setPaletteOpen(true)}
            onToggleSidebar={toggleSidebar}
          />
          <div className="app-content">
            <PageTransition pageKey={page + (openProject ? `-${openProject.name}` : '')}>
              {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
              {page === 'projects' && !openProject && (
                <Projects onOpenProject={openProjectDetail} />
              )}
              {page === 'projects' && openProject && (
                <ProjectDetail project={openProject} onBack={closeProjectDetail} />
              )}
              {page === 'tasks' && <Tasks />}
              {page === 'reports' && <Reports />}
              {page === 'settings' && <Settings />}
            </PageTransition>
          </div>
        </main>

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        />
      </div>
    </ToastProvider>
  )
}
