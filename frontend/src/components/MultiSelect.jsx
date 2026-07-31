import { useEffect, useRef, useState } from 'react'
import { IconChevronDown, IconCheck } from './icons.jsx'

function normalize(options) {
  return options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  )
}

/*
 * Multi-select dropdown (checkbox style).
 * - Controlled: value is an array, onChange receives the next array
 * - Trigger shows a count badge when selections exist
 * - "Clear" in the header resets the selection
 * - Keyboard: ArrowUp/Down navigate, Enter/Space toggles, Escape closes
 */
export default function MultiSelect({
  value = [],
  onChange,
  options = [],
  label = 'Filter',
  placeholder,
  icon: Icon,
}) {
  const opts = normalize(options)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef(null)

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

  const toggle = (opt) => {
    const next = value.includes(opt.value)
      ? value.filter((v) => v !== opt.value)
      : [...value, opt.value]
    onChange(next)
  }

  const clear = () => onChange([])

  const onTriggerKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
        setActive(0)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, opts.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active >= 0 && opts[active]) toggle(opts[active])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const count = value.length

  return (
    <div className={`dropdown ${open ? 'open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`dropdown-trigger ${open ? 'open' : ''}`}
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        {Icon && <Icon width="15" height="15" aria-hidden="true" />}
        <span className="dropdown-trigger-label">
          {count > 0 ? label : placeholder || label}
        </span>
        {count > 0 && <span className="dropdown-count">{count}</span>}
        <IconChevronDown width="14" height="14" className="dropdown-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="dropdown-menu" role="listbox" aria-multiselectable="true">
          <div className="dropdown-menu-header">
            <span>{label}</span>
            {count > 0 && (
              <button type="button" className="dropdown-clear" onClick={clear}>
                Clear
              </button>
            )}
          </div>
          {opts.map((opt, i) => {
            const checked = value.includes(opt.value)
            return (
              <button
                type="button"
                key={opt.value}
                role="option"
                aria-selected={checked}
                className={`dropdown-option ${i === active ? 'active' : ''} ${
                  checked ? 'selected multi' : ''
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => toggle(opt)}
              >
                <span className="dropdown-checkbox" aria-hidden="true">
                  {checked && <IconCheck width="11" height="11" />}
                </span>
                <span className="dropdown-option-label">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
