"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Never fight hash-anchor navigation or saved scroll restores.
    if (window.location.hash) return
    window.scrollTo({ top: 0, behavior: "auto" as ScrollBehavior })
  }, [pathname])

  return null
}
