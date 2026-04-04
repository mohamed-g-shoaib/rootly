"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDev = process.env.NODE_ENV !== "production"

  return (
    <main className="grid min-h-svh place-items-center bg-background py-6 sm:py-8">
      <PageContainer className="max-w-3xl">
        <Card className="w-full">
          <CardHeader className="items-center text-center">
            <p className="text-7xl leading-none font-semibold tracking-tight sm:text-8xl">
              500
            </p>
            <CardTitle className="text-2xl text-balance sm:text-3xl">
              We hit an unexpected error
            </CardTitle>
            <CardDescription className="mx-auto w-full max-w-xl text-center text-sm text-pretty sm:text-base">
              You can try again or return to a safe page.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-8">
            {isDev ? (
              <div className="rounded-xl border bg-muted/30 p-3 text-center text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Debug details</p>
                <p className="mt-2 break-words">{error.message}</p>
                {error.digest ? (
                  <p className="mt-1 break-all">digest: {error.digest}</p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={reset}>Try again</Button>

              <Button variant="outline" render={<Link href="/" />}>
                Go home
              </Button>

              <Button variant="ghost" render={<Link href="/overview" />}>
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </main>
  )
}
