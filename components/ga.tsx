"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function GAListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      ;(window as any).gtag("config", "G-QXTV38Q06W", {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}
