"use client"

import { useState, useRef, useEffect } from "react"

export function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<number>(0)
  const lastDisplay = useRef<number>(0)

  useEffect(() => {
    if (loading) return
    const start = performance.now()
    const duration = 400
    const from = 0

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(from + (value - from) * eased)
      
      if (current !== lastDisplay.current) {
        lastDisplay.current = current;
        setDisplay(current)
      }
      
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, loading])

  if (loading) return <span className="inline-block w-10 h-8 rounded-lg bg-black/10 animate-pulse" />
  return <>{display}</>
}
