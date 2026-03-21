"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft01Icon,
  GithubIcon,
  GoogleIcon,
  LinkedinIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import RootlyLogo from "@/components/rootly-logo"

export default function LoginPageUI() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")
  const callbackErrorMessage =
    errorParam === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null

  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(
    null
  )
  const [oauthErrorMessage, setOauthErrorMessage] = React.useState<
    string | null
  >(null)

  async function handleOAuthSignIn(provider: "google" | "github" | "linkedin") {
    setLoadingProvider(provider)
    setOauthErrorMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setOauthErrorMessage(error.message)
      setLoadingProvider(null)
    }
  }

  const isLoading = !!loadingProvider
  const errorMessage = oauthErrorMessage ?? callbackErrorMessage

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        Back to homepage
      </Link>

      <Card className="flex flex-col items-center gap-6 p-8 shadow-lg">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <RootlyLogo className="size-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-tight">Rootly</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-balance">
            Continue with Rootly
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground text-pretty">
            Sign in or create your learning notebook with one account.
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
          <div
            className="w-full rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <p className="max-w-xs text-center text-xs text-muted-foreground text-pretty">
          By signing in, you agree to our{" "}
          <span className="font-medium">Terms and Privacy Policy</span>.
        </p>
      </Card>
    </div>
  )
}
