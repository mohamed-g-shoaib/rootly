import { NextResponse } from "next/server"

const EXTENSION_ORIGIN_PREFIXES = ["chrome-extension://", "moz-extension://"]

function isAllowedExtensionOrigin(origin: string) {
  return EXTENSION_ORIGIN_PREFIXES.some((prefix) => origin.startsWith(prefix))
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
