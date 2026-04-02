const BOOTSTRAP_CACHE_KEY = "rootly.bootstrapCacheBySite"
const DRAFTS_STORAGE_KEY = "rootly.sidepanelDrafts"

function isRecord(value) {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

function normalizeBootstrapCacheEntry(value) {
  if (!isRecord(value) || !isRecord(value.data) || typeof value.cachedAt !== "number") {
    return null
  }

  return {
    cachedAt: value.cachedAt,
    data: value.data,
  }
}

function normalizeDrafts(value) {
  if (!isRecord(value)) {
    return null
  }

  return {
    note: isRecord(value.note) ? value.note : null,
    course: isRecord(value.course) ? value.course : null,
    daily: isRecord(value.daily) ? value.daily : null,
    timer: isRecord(value.timer) ? value.timer : null,
  }
}

export async function readBootstrapCache(siteBaseUrl) {
  const stored = await chrome.storage.local.get(BOOTSTRAP_CACHE_KEY)
  const cacheBySite = isRecord(stored[BOOTSTRAP_CACHE_KEY])
    ? stored[BOOTSTRAP_CACHE_KEY]
    : null

  return normalizeBootstrapCacheEntry(cacheBySite?.[siteBaseUrl])
}

export async function writeBootstrapCache(siteBaseUrl, data) {
  const stored = await chrome.storage.local.get(BOOTSTRAP_CACHE_KEY)
  const cacheBySite = isRecord(stored[BOOTSTRAP_CACHE_KEY])
    ? stored[BOOTSTRAP_CACHE_KEY]
    : {}

  await chrome.storage.local.set({
    [BOOTSTRAP_CACHE_KEY]: {
      ...cacheBySite,
      [siteBaseUrl]: {
        cachedAt: Date.now(),
        data,
      },
    },
  })
}

export async function clearBootstrapCache(siteBaseUrl) {
  const stored = await chrome.storage.local.get(BOOTSTRAP_CACHE_KEY)
  const cacheBySite = isRecord(stored[BOOTSTRAP_CACHE_KEY])
    ? { ...stored[BOOTSTRAP_CACHE_KEY] }
    : null

  if (!cacheBySite || !Object.hasOwn(cacheBySite, siteBaseUrl)) {
    return
  }

  delete cacheBySite[siteBaseUrl]

  await chrome.storage.local.set({
    [BOOTSTRAP_CACHE_KEY]: cacheBySite,
  })
}

export async function readDrafts() {
  const stored = await chrome.storage.local.get(DRAFTS_STORAGE_KEY)
  return normalizeDrafts(stored[DRAFTS_STORAGE_KEY])
}

export async function writeDrafts(drafts) {
  await chrome.storage.local.set({
    [DRAFTS_STORAGE_KEY]: drafts,
  })
}
