import { useEffect, useRef, useState } from 'react'

export default function PageTransition({ children, pageKey }) {
  const [state, setState] = useState('enter')
  const prevKey = useRef(pageKey)

  useEffect(() => {
    if (prevKey.current !== pageKey) {
      // Page changed — animate out then in
      setState('exit')
      const timer = setTimeout(() => {
        setState('enter')
        prevKey.current = pageKey
      }, 150) // Match CSS exit duration
      return () => clearTimeout(timer)
    }
  }, [pageKey])

  return (
    <div className={`page-transition page-${state}`}>
      {children}
    </div>
  )
}
