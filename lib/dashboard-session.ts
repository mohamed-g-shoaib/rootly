import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const getDashboardSupabase = cache(async () => createClient())

export type DashboardShellUser = {
  email?: string
  user_metadata?: {
    full_name?: string
    name?: string
    avatar_url?: string
    picture?: string
  }
}

export const getDashboardUser = cache(async () => {
  const supabase = await getDashboardSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
})

export const getDashboardShellUser = cache(async (): Promise<DashboardShellUser | null> => {
  const supabase = await getDashboardSupabase()
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims) {
    return null
  }

  return {
    email: typeof claims.email === "string" ? claims.email : undefined,
    user_metadata:
      claims.user_metadata &&
      typeof claims.user_metadata === "object" &&
      !Array.isArray(claims.user_metadata)
        ? {
            full_name:
              typeof claims.user_metadata.full_name === "string"
                ? claims.user_metadata.full_name
                : undefined,
            name:
              typeof claims.user_metadata.name === "string"
                ? claims.user_metadata.name
                : undefined,
            avatar_url:
              typeof claims.user_metadata.avatar_url === "string"
                ? claims.user_metadata.avatar_url
                : undefined,
            picture:
              typeof claims.user_metadata.picture === "string"
                ? claims.user_metadata.picture
                : undefined,
          }
        : undefined,
  }
})

export const getDashboardUserId = cache(async (): Promise<string | null> => {
  const supabase = await getDashboardSupabase()
  const { data, error } = await supabase.auth.getClaims()
  const subject = data?.claims?.sub

  if (error || typeof subject !== "string" || subject.length === 0) {
    return null
  }

  return subject
})
