export const DEV_BASE_URL = "http://localhost:3000"
export const PROD_BASE_URL = "https://rootly.app"
const SITE_URL_STORAGE_KEY = "rootly.siteBaseUrl"

export const SITE_ENV_OPTIONS = [
  {
    value: PROD_BASE_URL,
    label: "Production",
    hint: "rootly.app",
  },
  {
    value: DEV_BASE_URL,
    label: "Localhost",
    hint: "localhost:3000",
  },
]

function normalizeSiteBaseUrl(value) {
  const normalizedValue =
    typeof value === "string" ? value.replace(/\/+$/, "") : ""

  return (
    SITE_ENV_OPTIONS.find((option) => option.value === normalizedValue)
      ?.value ?? PROD_BASE_URL
  )
}

export function getSiteEnvironmentLabel(value) {
  const normalizedValue = normalizeSiteBaseUrl(value)

  return (
    SITE_ENV_OPTIONS.find((option) => option.value === normalizedValue)
      ?.label ?? "Production"
  )
}

export async function resolveSiteBaseUrl() {
  const stored = await chrome.storage.local.get(SITE_URL_STORAGE_KEY)
  return normalizeSiteBaseUrl(stored[SITE_URL_STORAGE_KEY])
}

export async function setSiteBaseUrl(nextBaseUrl) {
  const normalizedValue = normalizeSiteBaseUrl(nextBaseUrl)

  await chrome.storage.local.set({
    [SITE_URL_STORAGE_KEY]: normalizedValue,
  })

  return normalizedValue
}

export async function openRootlyPath(path) {
  const baseUrl = await resolveSiteBaseUrl()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  await chrome.tabs.create({
    url: `${baseUrl}${normalizedPath}`,
  })
}
