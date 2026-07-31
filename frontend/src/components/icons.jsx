// Minimal outline icon set (inline SVG, currentColor).

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconDashboard = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
)

export const IconProjects = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
)

export const IconTasks = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M9 6h12M9 12h12M9 18h12" />
    <path d="m3 6 1.2 1.2L6 5.4M3 12l1.2 1.2L6 11.4M3 18l1.2 1.2L6 17.4" />
  </svg>
)

export const IconReports = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)

export const IconSettings = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
  </svg>
)

export const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const IconPlus = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export const IconMore = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
)

export const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const IconTrendUp = (props) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...props}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
)

export const IconTrendDown = (props) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...props}>
    <path d="M3 7l6 6 4-4 8 8" />
    <path d="M15 17h6v-6" />
  </svg>
)

export const IconTrendFlat = (props) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...props}>
    <path d="M3 12h18" />
  </svg>
)

export const IconInbox = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 13h5l2 3h4l2-3h5" />
    <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
  </svg>
)

export const IconUser = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
)

export const IconLogout = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
)

export const IconDownload = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)

export const IconFile = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
)

export const IconBell = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)

export const IconRefresh = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
)

export const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...props}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

export const IconFilter = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 5h18l-7 8.5V19l-4 2v-7.5L3 5Z" />
  </svg>
)

export const IconSort = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
  </svg>
)

export const IconX = (props) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const IconFlag = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 22V4" />
    <path d="M4 5h12l-3 4 3 4H4" />
  </svg>
)

export const IconCalendar = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
)

export const IconArrowRight = (props) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconEye = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const IconPencil = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
)

export const IconCopy = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export const IconArchive = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="2" y="4" width="20" height="4" rx="1" />
    <path d="M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
)

export const IconSun = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const IconMoon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)

export const IconZap = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
)

export const IconCornerLeftUp = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14 9 9 4 4 9" />
    <path d="M20 20h-7a4 4 0 0 1-4-4V4" />
  </svg>
)

export const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
)

export const IconArrowLeft = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
)

export const IconClock = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const IconTag = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12.6 3H6a3 3 0 0 0-3 3v6.6a2 2 0 0 0 .59 1.42l7.4 7.4a2 2 0 0 0 2.82 0l7.4-7.4a2 2 0 0 0 0-2.82l-7.4-7.4A2 2 0 0 0 12.6 3Z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
)

export const IconMapPin = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const IconBuilding = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" />
    <path d="M15 9h4a1 1 0 0 1 1 1v11" />
    <path d="M2 21h20" />
    <path d="M7 6h2M7 10h2M7 14h2M11 6h2M11 10h2M11 14h2" />
  </svg>
)

export const IconShield = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const IconExternalLink = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
  </svg>
)

export const IconTrash = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const IconFileText = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h6" />
  </svg>
)

export const IconFilePdf = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h1.5a1.5 1.5 0 0 1 0 3H9v3M14 13h1a2 2 0 0 1 0 4h-1v2" />
  </svg>
)

export const IconFileSheet = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h8M12 13v4" />
  </svg>
)

export const IconGauge = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 14 15.5 9.5" />
    <path d="M4.5 19a9 9 0 1 1 15 0" />
  </svg>
)
