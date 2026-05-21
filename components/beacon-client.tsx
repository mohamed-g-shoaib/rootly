"use client"

import { useEffect } from "react"

const STORAGE_KEY = "rootly_beacon_last_ping_at"
const PING_INTERVAL_MS = 1000 * 60 * 60 * 24 // 24h

export function BeaconClient() {
  useEffect(() => {
    try {
      const lastRaw = localStorage.getItem(STORAGE_KEY)
      const last = lastRaw ? Number(lastRaw) : 0
      const now = Date.now()

      if (Number.isFinite(last) && now - last < PING_INTERVAL_MS) return

      // Fire-and-forget. If the browser is offline or the request fails,
      // we’ll try again on the next navigation.
      void fetch("/api/beacon", { method: "POST" })
        .then(() => {
          localStorage.setItem(STORAGE_KEY, String(now))
          return undefined
        })
        .catch(() => {})
    } catch {
      // Ignore storage errors (Safari private mode, disabled storage, etc).
    }
  }, [])

  return null
}
