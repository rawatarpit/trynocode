import { useEffect, useState } from 'react'
import {
  IconArrowLeft,
  IconCalendar,
  IconFlag,
  IconCheck,
  IconUser,
  IconClock,
  IconTag,
  IconMapPin,
  IconShield,
  IconExternalLink,
  IconFileText,
  IconFilePdf,
  IconFileSheet,
  IconDownload,
  IconGauge,
  IconMore,
} from '../components/icons.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useToast } from '../components/Toast.jsx'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity' },
]

function ProgressRing({ value }) {
  const r = 42
  const c = 2 * Math.PI * r
  const filled = (value / 100) * c
  return (
    <div className="ring-wrap">
      <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
        <circle cx="52" cy="52" r={r} fill="none" stroke="var(--border)" strokeWidth="9" />
        <circle
          cx="52"
          cy="52"
          r={r}
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          transform="rotate(-90 52 52)"
          style={{ transition: 'stroke-dasharray 0.5s var(--ease-out)' }}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-value">{value}%</span>
        <span className="ring-label">complete</span>
      </div>
    </div>
  )
}

function StatTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-icon"><Icon width="16" height="16" /></span>
      <div className="stat-tile-body">
        <span className="stat-tile-label">{label}</span>
        <span className="stat-tile-value">{value}</span>
        {sub && <span className="stat-tile-sub">{sub}</span>}
      </div>
    </div>
  )
}

function FactRow({ icon: Icon, label, value, valueClass }) {
  return (
    <div className="fact-row">
      <span className="fact-label">
        <Icon width="14" height="14" />
        {label}
      </span>
      <span className={`fact-value ${valueClass || ''}`}>{value}</span>
    </div>
  )
}

function OverviewTab({ project, detail, toast }) {
  const milestones = detail.milestones || []
  const doneCount = milestones.filter((m) => m.done).length
  return (
    <div className="detail-panels">
      <div className="dp-main">
        <section className="card detail-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">About this project</h3>
              <p className="card-subtitle">Scope and background</p>
            </div>
          </div>
          <div className="card-body">
            <p className="about-text">{detail.description}</p>
            <div className="about-chips">
              <span className="about-chip"><IconTag width="13" height="13" />{detail.category}</span>
              <span className="about-chip"><IconMapPin width="13" height="13" />{detail.location}</span>
              <span className="about-chip"><IconCalendar width="13" height="13" />{detail.start}</span>
            </div>
          </div>
        </section>

        <section className="card detail-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Key facts</h3>
              <p className="card-subtitle">Reference details</p>
            </div>
          </div>
          <div className="card-body">
            <div className="fact-list">
              <FactRow icon={IconUser} label="Owner" value={project.owner} />
              <FactRow icon={IconFlag} label="Budget" value={project.budget} valueClass="fact-strong" />
              <FactRow icon={IconClock} label="Timeline" value={`${detail.start} – ${detail.end}`} />
              <FactRow icon={IconShield} label="Risk" value={<span className={`risk-pill risk-${String(detail.risk || 'low').toLowerCase()}`}>{detail.risk}</span>} />
              <FactRow icon={IconGauge} label="Milestones" value={`${doneCount} of ${milestones.length} done`} />
            </div>
          </div>
        </section>
      </div>

      <aside className="dp-side">
        <section className="card detail-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Team</h3>
              <p className="card-subtitle">{(detail.team || []).length} members</p>
            </div>
          </div>
          <div className="card-body">
            <div className="team-list">
              {(detail.team || []).map((t, i) => (
                <div key={t.name} className="team-row">
                  <span className={`avatar avatar-sm avatar-tone-${i % 5}`}>{t.initials}</span>
                  <div className="team-info">
                    <div className="team-name">{t.name}</div>
                    <div className="team-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card detail-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Quick actions</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button className="quick-action" onClick={() => toast.info('Opening supplier portal…')}>
                <IconExternalLink width="15" height="15" /> Open supplier portal
              </button>
              <button className="quick-action" onClick={() => toast.info('Budget change request submitted')}>
                <IconFlag width="15" height="15" /> Request budget change
              </button>
              <button className="quick-action" onClick={() => toast.info('Review scheduled — calendar invite sent')}>
                <IconCalendar width="15" height="15" /> Schedule review
              </button>
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}

function MilestonesTab({ milestones }) {
  const done = milestones.filter((m) => m.done).length
  const total = milestones.length
  return (
    <div className="detail-single">
      <section className="card detail-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Milestones</h3>
            <p className="card-subtitle">{done} of {total} complete</p>
          </div>
          <span className="stat-chip">{Math.round((done / Math.max(total, 1)) * 100)}%</span>
        </div>
        <div className="card-body">
          <ol className="milestone-list">
            {milestones.map((m) => (
              <li key={m.title} className={`milestone-item ${m.done ? 'done' : ''}`}>
                <span className="milestone-node" aria-hidden="true">
                  {m.done && <IconCheck width="12" height="12" />}
                </span>
                <div className="milestone-body">
                  <div className="milestone-title">{m.title}</div>
                  <div className="milestone-date">
                    <IconCalendar width="12" height="12" />
                    {m.date}
                  </div>
                </div>
                <span className="milestone-state">
                  {m.done ? 'Complete' : 'Upcoming'}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

function fileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return IconFilePdf
  if (ext === 'xlsx' || ext === 'csv') return IconFileSheet
  if (ext === 'docx' || ext === 'doc') return IconFileText
  return IconFileText
}

function DocumentsTab({ documents, toast }) {
  return (
    <div className="detail-single">
      <section className="card detail-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Documents</h3>
            <p className="card-subtitle">Attachments and agreements</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast.info('Preparing all files for download…')}>
            <IconDownload width="14" height="14" />
            All files
          </button>
        </div>
        <div className="card-body">
          <div className="doc-list">
            {documents.map((d) => {
              const Icon = fileIcon(d.name)
              const ext = d.name.split('.').pop()?.toUpperCase()
              return (
                <div key={d.name} className="doc-item">
                  <span className="doc-icon"><Icon width="17" height="17" /></span>
                  <div className="doc-info">
                    <div className="doc-name">{d.name}</div>
                    <div className="doc-meta">
                      <span className="doc-ext">{ext}</span> · {d.size} · {d.date}
                    </div>
                  </div>
                  <button
                    className="btn btn-icon btn-sm"
                    aria-label={`Download ${d.name}`}
                    onClick={() => toast.info(`Downloading ${d.name}…`)}
                  >
                    <IconDownload width="14" height="14" />
                  </button>
                  <button className="btn btn-icon btn-sm" aria-label={`More options for ${d.name}`}>
                    <IconMore width="14" height="14" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function ActivityTab({ activity }) {
  return (
    <div className="detail-single">
      <section className="card detail-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent activity</h3>
            <p className="card-subtitle">Everything that happened on this project</p>
          </div>
        </div>
        <div className="card-body">
          <div className="activity-list">
            {activity.map((item, i) => (
              <div key={item.text + i} className="activity-item">
                <div className="activity-marker">
                  <span className="activity-dot" style={{ background: item.color }} />
                  {i < activity.length - 1 && <span className="activity-line" aria-hidden="true" />}
                </div>
                <div className="activity-body">
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ProjectDetail({ project, onBack }) {
  const [tab, setTab] = useState('overview')
  const toast = useToast()

  // Escape returns to the list.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onBack()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onBack])

  if (!project) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-illustration"><IconFileText width="26" height="26" /></div>
            <h3 className="empty-title">Project not found</h3>
            <button className="btn btn-secondary" onClick={onBack}>Back to projects</button>
          </div>
        </div>
      </div>
    )
  }

  const detail = project.details || {}
  const milestones = detail.milestones || []
  const documents = detail.documents || []
  const activity = detail.activity || []
  const doneCount = milestones.filter((m) => m.done).length
  const duration = `${detail.start} – ${detail.end}`

  const tabMeta = {
    overview: { label: 'Overview' },
    milestones: { label: 'Milestones', count: milestones.length },
    documents: { label: 'Documents', count: documents.length },
    activity: { label: 'Activity', count: activity.length },
  }

  return (
    <div className="detail-page">
      {/* Back bar */}
      <div className="detail-topbar">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <IconArrowLeft width="14" height="14" />
          Projects
        </button>
        <span className="detail-crumb">Procurement / Projects / {project.name}</span>
        <span className="detail-esc-hint"><kbd>esc</kbd> to go back</span>
      </div>

      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-hero-main">
          <div className="detail-hero-id">
            <span className="detail-id-text">{detail.id}</span>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="detail-title">{project.name}</h1>
          <p className="detail-desc">{detail.description}</p>

          <div className="detail-progress-row">
            <div className="detail-progress-track">
              <div className="progress-fill" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="detail-progress-label">{project.progress}% complete</span>
          </div>
        </div>

        <div className="detail-hero-side">
          <ProgressRing value={project.progress} />
          <div className="detail-hero-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => toast.info('Export prepared — check your downloads')}>
              <IconDownload width="14" height="14" />
              Export
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => toast.success('Change request submitted for review')}>
              <IconFlag width="14" height="14" />
              Request change
            </button>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="stat-tile-grid">
        <StatTile icon={IconFlag} label="Budget" value={project.budget} />
        <StatTile icon={IconClock} label="Timeline" value={duration} />
        <StatTile icon={IconUser} label="Team" value={(detail.team || []).length} sub="members" />
        <StatTile icon={IconGauge} label="Milestones" value={`${doneCount}/${milestones.length}`} sub="complete" />
      </div>

      {/* Tabs */}
      <div className="detail-tabs" role="tablist" aria-label="Project sections">
        {TABS.map((t) => {
          const meta = tabMeta[t.id] || { label: t.label }
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              className={`detail-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {meta.label}
              {meta.count !== undefined && (
                <span className="tab-count" aria-hidden="true">{meta.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab panels */}
      <div
        className="detail-tab-panel"
        key={tab}
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {tab === 'overview' && <OverviewTab project={project} detail={detail} toast={toast} />}
        {tab === 'milestones' && <MilestonesTab milestones={milestones} />}
        {tab === 'documents' && <DocumentsTab documents={documents} toast={toast} />}
        {tab === 'activity' && <ActivityTab activity={activity} />}
      </div>
    </div>
  )
}
