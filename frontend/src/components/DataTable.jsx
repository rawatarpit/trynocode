import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconMore,
  IconSearch,
  IconEye,
  IconPencil,
  IconCopy,
  IconArchive,
} from './icons.jsx'

function getCellClass(col) {
  if (col.align === 'right') return 'cell-numeric'
  if (col.primary) return 'cell-primary'
  if (col.secondary) return 'cell-secondary'
  if (col.muted) return 'cell-muted'
  return ''
}

function getSortValue(col, row) {
  if (col.sortValue) return col.sortValue(row)
  return row[col.key]
}

function compare(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/* Row overflow menu: view / edit / duplicate / archive. */
function RowActions({ onView }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
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
  }, [open])

  const act = (fn) => () => {
    setOpen(false)
    if (fn) fn()
  }

  return (
    // Stop clicks from bubbling to a clickable row (e.g. Projects detail nav).
    // Only stop Enter/Space on keydown — Escape must still reach the document
    // listener that closes the menu.
    <span
      className="row-menu-wrap"
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') e.stopPropagation()
      }}
    >
      <button
        type="button"
        className="btn btn-icon btn-sm"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <IconMore width="16" height="16" />
      </button>
      {open && (
        <div className="row-menu" role="menu" aria-label="Row actions">
          <button type="button" role="menuitem" className="row-menu-item" onClick={act(onView)}>
            <IconEye width="15" height="15" aria-hidden="true" />
            View details
          </button>
          <button type="button" role="menuitem" className="row-menu-item" onClick={act()}>
            <IconPencil width="15" height="15" aria-hidden="true" />
            Edit
          </button>
          <button type="button" role="menuitem" className="row-menu-item" onClick={act()}>
            <IconCopy width="15" height="15" aria-hidden="true" />
            Duplicate
          </button>
          <div className="row-menu-divider" aria-hidden="true" />
          <button type="button" role="menuitem" className="row-menu-item danger" onClick={act()}>
            <IconArchive width="15" height="15" aria-hidden="true" />
            Archive
          </button>
        </div>
      )}
    </span>
  )
}

/*
 * Data table with built-in sorting (click headers) and an empty state.
 * - Column config: key, label, align, primary/secondary/muted, render, sortable (default true), sortValue
 */
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  renderActions,
  onClearFilters,
  onRowClick,
}) {
  const [sort, setSort] = useState(null) // { key, dir: 'asc' | 'desc' }

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => compare(getSortValue(col, a), getSortValue(col, b)) * dir)
  }, [rows, sort, columns])

  const toggleSort = (col) => {
    if (col.sortable === false) return
    setSort((prev) =>
      prev?.key === col.key
        ? prev.dir === 'asc'
          ? { key: col.key, dir: 'desc' }
          : null
        : { key: col.key, dir: 'asc' }
    )
  }

  const renderIndicator = (col) => {
    if (col.sortable === false) return null
    if (sort?.key === col.key) {
      return (
        <span className={`sort-indicator active ${sort.dir}`} aria-hidden="true">
          {sort.dir === 'asc' ? '\u2191' : '\u2193'}
        </span>
      )
    }
    return <span className="sort-indicator" aria-hidden="true">{'\u2195'}</span>
  }

  const colSpan = columns.length + (renderActions ? 1 : 0)

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable === false ? undefined : 'sortable'}
                onClick={() => toggleSort(col)}
                style={{ textAlign: col.align === 'right' ? 'right' : 'left' }}
                aria-sort={
                  sort?.key === col.key
                    ? sort.dir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {col.label}
                {renderIndicator(col)}
              </th>
            ))}
            {renderActions && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="table-empty-cell">
                <div className="table-empty">
                  <div className="empty-illustration">
                    <IconSearch width="26" height="26" />
                  </div>
                  <h3 className="empty-title">No results found</h3>
                  <p className="empty-text">
                    No rows match your current search or filters.
                  </p>
                  {onClearFilters && (
                    <button className="btn btn-secondary btn-sm" onClick={onClearFilters}>
                      Clear filters
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={row[rowKey]}
                className={onRowClick ? 'row-clickable' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick ? 'Open details' : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={getCellClass(col)}
                    style={{ textAlign: col.align === 'right' ? 'right' : 'left' }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="cell-actions">
                    <RowActions onView={onRowClick ? () => onRowClick(row) : undefined} />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
