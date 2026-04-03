import { NextResponse } from "next/server"

const EXTENSION_ORIGIN_PREFIXES = ["chrome-extension://", "moz-extension://"]
const ALLOWED_EXTENSION_IDS = (process.env.ROOTLY_EXTENSION_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter((value) => value.length > 0)

function getExtensionOriginId(origin: string) {
  try {
    const parsed = new URL(origin)

    if (!EXTENSION_ORIGIN_PREFIXES.includes(`${parsed.protocol}//`)) {
      return null
    }

    return parsed.host || null
  } catch {
    return null
  }
}

function isAllowedExtensionOrigin(origin: string) {
  const extensionId = getExtensionOriginId(origin)

  if (!extensionId) {
    return false
  }

  if (ALLOWED_EXTENSION_IDS.length === 0) {
    return true
  }

  return ALLOWED_EXTENSION_IDS.includes(extensionId)
}

export function getExtensionCorsHeaders(origin: string | null | undefined) {
  const headers = new Headers()

  if (!origin || !isAllowedExtensionOrigin(origin)) {
    return headers
  }

  // TODO: tighten this to explicit extension IDs before production release.
  headers.set("Access-Control-Allow-Origin", origin)
  headers.set("Access-Control-Allow-Credentials", "true")
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type")
  headers.set("Vary", "Origin")

  return headers
}

export function jsonWithExtensionCors(
  body: unknown,
  {
    origin,
    ...init
  }: ResponseInit & {
    origin: string | null | undefined
  }
) {
  const headers = getExtensionCorsHeaders(origin)

  if (init.headers) {
    const incoming = new Headers(init.headers)

    incoming.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  return NextResponse.json(body, {
    ...init,
    headers,
  })
}
