"use client"

import { AuthAwareCta } from "./auth-aware-cta"
import { Reveal } from "./reveal"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"

export default function HomepageHero() {
  return (
    <section className="pt-24">
      <PageContainer>
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 text-left sm:items-center sm:text-center">
          <div className="flex flex-col gap-4">
            <Reveal
              as="h1"
              mode="mount"
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              The learning notebook built for developers.
            </Reveal>

            <Reveal
              as="p"
              mode="mount"
              delay={0.1}
              className="text-base text-muted-foreground sm:text-lg"
            >
              Capture notes, track progress, and review what you&apos;ve learned
              — all in one place.
            </Reveal>
          </div>

          <Reveal
            mode="mount"
            delay={0.2}
            className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
          >
            <AuthAwareCta />

            <Button
              variant="outline"
              render={<a href="#mockup" aria-label="See how it works" />}
              className="w-full sm:w-auto"
            >
              See how it works
            </Button>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  )
}
