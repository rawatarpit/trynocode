import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Dropdown from '../components/Dropdown.jsx'
import { useToast } from '../components/Toast.jsx'
import { IconBell, IconCheck, IconRefresh } from '../components/icons.jsx'

const SECTIONS = ['Organization', 'Team', 'Approvals', 'Notifications', 'Security']

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
]

const APPROVAL_OPTIONS = [
  { value: '1', label: '1 level' },
  { value: '2', label: '2 levels' },
  { value: '3', label: '3 levels' },
]

const SECTION_BLURBS = {
  Team: 'Manage members, roles, and access across the workspace.',
  Approvals: 'Configure approval chains and delegation rules.',
  Notifications: 'Choose which events trigger email and in-app alerts.',
  Security: 'SSO, session policies, and audit log retention.',
}

function ComingSoon({ section }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{section}</h3>
          <p className="card-subtitle">{SECTION_BLURBS[section]}</p>
        </div>
      </div>
      <div className="card-body">
        <div className="empty-state">
          <div className="empty-illustration">
            <IconBell width="26" height="26" />
          </div>
          <h3 className="empty-title">{section} is not available in this preview</h3>
          <p className="empty-text">
            This section is part of the full workspace configuration. The Organization settings
            above are editable in this demo.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('Organization')
  const [currency, setCurrency] = useState('USD')
  const [approvalLevels, setApprovalLevels] = useState('2')
  const toast = useToast()

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  const handleReset = () => {
    toast.info('Settings reset to defaults')
  }

  return (
    <>
      <PageHeader
        crumb="Administration / Settings"
        title="Settings"
        subtitle="Workspace configuration"
        actions={
          <>
            <button className="btn btn-secondary" onClick={handleReset}>
              <IconRefresh width="15" height="15" aria-hidden="true" />
              Reset
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <IconCheck width="15" height="15" aria-hidden="true" />
              Save changes
            </button>
          </>
        }
      />

      <div className="settings-grid">
        <div className="card">
          <nav className="settings-nav" aria-label="Settings sections">
            {SECTIONS.map((s) => (
              <button
                key={s}
                className={`settings-nav-item ${s === activeSection ? 'active' : ''}`}
                onClick={() => setActiveSection(s)}
                aria-current={s === activeSection ? 'page' : undefined}
              >
                {s}
              </button>
            ))}
          </nav>
        </div>

        {activeSection === 'Organization' ? (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Organization</h3>
                <p className="card-subtitle">Core workspace identity and defaults</p>
              </div>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-row">
                  <label htmlFor="org-name">Organization name</label>
                  <input id="org-name" className="input" defaultValue="Elevate Corp" />
                </div>
                <div className="form-row">
                  <label htmlFor="org-domain">Domain</label>
                  <input id="org-domain" className="input" defaultValue="elevatecorp.com" />
                </div>
                <div className="form-row">
                  <label htmlFor="default-currency">Default currency</label>
                  <Dropdown
                    options={CURRENCY_OPTIONS}
                    value={currency}
                    onChange={setCurrency}
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="approval-levels">Approval levels</label>
                  <Dropdown
                    options={APPROVAL_OPTIONS}
                    value={approvalLevels}
                    onChange={setApprovalLevels}
                  />
                </div>
              </div>

              <div className="empty-state" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-4)' }}>
                <div className="empty-illustration">
                  <IconBell width="26" height="26" />
                </div>
                <h3 className="empty-title">Notifications are on</h3>
                <p className="empty-text">
                  Team members receive email alerts for approvals, rejections, and status changes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ComingSoon section={activeSection} />
        )}
      </div>
    </>
  )
}
