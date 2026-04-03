function normalizePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

export function buildExtensionIdempotencyKey({ userId, date, requestId }) {
  if (!userId || !date || !requestId) {
    return null
  }

  return `${userId}:${date}:${requestId}`
}

export function createInMemoryIdempotencyStore({
  ttlMs = 10 * 60 * 1000,
  maxEntries = 2000,
} = {}) {
  const normalizedTtlMs = normalizePositiveInteger(ttlMs, 10 * 60 * 1000)
  const normalizedMaxEntries = normalizePositiveInteger(maxEntries, 2000)
  const map = new Map()

  function prune(now = Date.now()) {
    for (const [key, entry] of map.entries()) {
      if (entry.expiresAt <= now) {
        map.delete(key)
      }
    }

    while (map.size > normalizedMaxEntries) {
      const oldestKey = map.keys().next().value

      if (oldestKey == null) {
        break
      }

      map.delete(oldestKey)
    }
  }

  function get(key, now = Date.now()) {
    const entry = map.get(key)

    if (!entry) {
      return null
    }

    if (entry.expiresAt <= now) {
      map.delete(key)
      return null
    }

    return entry.value
  }

  function set(key, value, now = Date.now()) {
    map.set(key, {
      value,
      expiresAt: now + normalizedTtlMs,
    })

    prune(now)
  }

  return {
    get,
    prune,
    set,
  }
}
