import { resolveSiteBaseUrl } from "./config.js"

export async function apiFetch(path, init = {}) {
  const baseUrl = await resolveSiteBaseUrl()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
    },
  })

  let body = null

  try {
    body = await response.json()
  } catch {}

  if (!response.ok) {
    const error = new Error(
      body?.error ?? `Request failed with ${response.status}`
    )
    error.status = response.status
    error.body = body
    throw error
  }

  return body
}
