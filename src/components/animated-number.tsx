"use client"

import { useState, useRef, useEffect } from "react"

export function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  const safeValue = Number.isFinite(value) ? value : 0
  const [display, setDisplay] = useState(0)
  const raf = useRef<number>(0)
  const lastDisplay = useRef<number>(0)

  useEffect(() => {
    // Reduced motion: defer one tick per repo lint pattern.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeoutId = setTimeout(() => {
        lastDisplay.current = safeValue
        setDisplay(safeValue)
      }, 0)
      return () => clearTimeout(timeoutId)
    }
    const start = performance.now()
    const duration = 400
    // Animate from the last shown value, not 0 — otherwise 120→121 replays 0→121.
    const from = lastDisplay.current

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(from + (safeValue - from) * eased)

      if (current !== lastDisplay.current) {
        lastDisplay.current = current;
        setDisplay(current)
      }

      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [safeValue, loading])

  if (loading) return <span role="status" aria-label="Loading number" className="inline-block w-10 h-8 rounded-lg bg-black/10 animate-pulse" />
  return <span className="tabular-nums">{display.toLocaleString("en-IN")}</span>
}
