import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IconCheck, IconX } from './icons.jsx'

const ToastContext = createContext(null)

let toastId = 0

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const add = useCallback((message, { type = 'info', duration = 3500 } = {}) => {
    const id = ++toastId
    setToasts((t) => [...t, { id, message, type }])
    timers.current[id] = setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  const success = useCallback((msg, opts) => add(msg, { ...opts, type: 'success' }), [add])
  const error = useCallback((msg, opts) => add(msg, { ...opts, type: 'error' }), [add])
  const info = useCallback((msg, opts) => add(msg, { ...opts, type: 'info' }), [add])

  // Cleanup on unmount.
  useEffect(() => {
    const t = timers.current
    return () => Object.values(t).forEach(clearTimeout)
  }, [])

  return (
    <ToastContext.Provider value={{ add, success, error, info, remove }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }) {
  const ref = useRef(null)
  const [exiting, setExiting] = useState(false)

  const handleDismiss = () => {
    setExiting(true)
    setTimeout(onDismiss, 180)
  }

  const IconComponent = toast.type === 'success' ? IconCheck
    : toast.type === 'error' ? IconX
    : null

  return (
    <div
      ref={ref}
      className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : ''}`}
      role="alert"
    >
      {IconComponent && (
        <span className="toast-icon">
          <IconComponent width="16" height="16" />
        </span>
      )}
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        <IconX width="14" height="14" />
      </button>
    </div>
  )
}
