import { useEffect, useRef, useState } from 'react'
import { IconChevronDown, IconCheck, IconSearch } from './icons.jsx'

function normalize(options) {
  return options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  )
}

/*
 * Custom dropdown (replaces native <select>).
 * - Controlled (value + onChange) or uncontrolled (defaultValue)
 * - Optional searchable mode (filters options as you type)
 * - Keyboard: ArrowUp/Down, Enter/Space select, Escape/Tab closes
 * - Click outside closes; selected option gets a check
 */
export default function Dropdown({
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = 'Select…',
  icon: Icon,
  className = '',
  searchable = false,
}) {
  const opts = normalize(options)
  const controlled = onChange !== undefined
  const [internal, setInternal] = useState(defaultValue ?? opts[0]?.value ?? '')
  const current = controlled ? value : internal
  const selected = opts.find((o) => o.value === current) || null

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)

  const q = query.trim().toLowerCase()
  const visible = searchable && q ? opts.filter((o) => o.label.toLowerCase().includes(q)) : opts

  useEffect(() => {
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const openMenu = () => {
    setQuery('')
    setOpen(true)
    const idx = visible.findIndex((o) => o.value === current)
    setActive(idx >= 0 ? idx : 0)
  }

  const select = (opt) => {
    if (controlled) onChange(opt.value)
    else setInternal(opt.value)
    setOpen(false)
  }

  const onTriggerKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openMenu()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, visible.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active >= 0 && visible[active]) select(visible[active])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const onMenuKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, visible.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active >= 0 && visible[active]) select(visible[active])
    }
  }

  return (
    <div className={`dropdown ${className}`} ref={rootRef}>
      <button
        type="button"
        className={`dropdown-trigger ${open ? 'open' : ''}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {Icon && <Icon width="15" height="15" aria-hidden="true" />}
        <span className="dropdown-trigger-label">
          {selected ? selected.label : placeholder}
        </span>
        <IconChevronDown width="14" height="14" className="dropdown-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="dropdown-menu" role="listbox" onKeyDown={onMenuKeyDown}>
          {searchable && (
            <div className="dropdown-search">
              <IconSearch aria-hidden="true" />
              <input
                className="input dropdown-search-input"
                placeholder="Search…"
                value={query}
                autoFocus
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault()
                }}
              />
            </div>
          )}
          {visible.length === 0 && (
            <div className="dropdown-empty">No matches</div>
          )}
          {visible.map((opt, i) => (
            <button
              type="button"
              key={opt.value}
              role="option"
              aria-selected={opt.value === current}
              className={`dropdown-option ${i === active ? 'active' : ''} ${
                opt.value === current ? 'selected' : ''
              }`}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(opt)}
            >
              <span className="dropdown-option-label">{opt.label}</span>
              {opt.value === current && (
                <IconCheck width="15" height="15" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
