"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  GithubIcon,
  GoogleIcon,
  LinkedinIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPageUI() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")

  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(
    null
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (errorParam === "auth_callback_failed") {
      setErrorMessage("Authentication failed. Please try again.")
    }
  }, [errorParam])

  async function handleOAuthSignIn(provider: "google" | "github" | "linkedin") {
    setLoadingProvider(provider)
    setErrorMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setLoadingProvider(null)
    }
  }

  const isLoading = !!loadingProvider

  return (
    <Card className="flex flex-col items-center gap-6 p-8 shadow-lg">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8 text-primary"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">Rootly</span>
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your learning notebook
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading}
          aria-busy={loadingProvider === "google"}
        >
          {loadingProvider === "google" ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={GoogleIcon} size={20} />
          )}
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading}
          aria-busy={loadingProvider === "github"}
        >
          {loadingProvider === "github" ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={GithubIcon} size={20} />
          )}
          Continue with GitHub
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          type="button"
          onClick={() => handleOAuthSignIn("linkedin")}
          disabled={isLoading}
          aria-busy={loadingProvider === "linkedin"}
        >
          {loadingProvider === "linkedin" ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={LinkedinIcon} size={20} />
          )}
          Continue with LinkedIn
        </Button>
      </div>

      {errorMessage && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our <br />
        <span className="font-medium">Terms and Privacy Policy</span>
      </p>
    </Card>
  )
}
