"use client"

import { Reveal } from "./reveal"
import { MarketingPrimaryCta } from "./marketing-primary-cta"
import { PageContainer } from "@/components/ui/page-container"
import { HomepageExtensionDialog } from "./homepage-extension-dialog"
import { BrowserWindowMock } from "./hero-browser-mock"

export default function HomepageHero() {
  return (
    <section className="pt-24">
      <PageContainer>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Reveal
                as="h1"
                mode="mount"
                delay={0.05}
                className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                Turn scattered learning into organized progress.
              </Reveal>

              <Reveal
                as="p"
                mode="mount"
                delay={0.1}
                className="text-base text-pretty text-muted-foreground sm:text-lg lg:max-w-2xl"
              >
                Capture notes, track study time, and review what you've learned
                organized around the courses you're actually taking.
              </Reveal>
            </div>

            <Reveal
              mode="mount"
              delay={0.15}
              className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
            >
              <MarketingPrimaryCta />
              <HomepageExtensionDialog buttonClassName="w-full sm:w-auto" />
            </Reveal>
          </div>

          <Reveal mode="mount" delay={0.2}>
            <BrowserWindowMock />
          </Reveal>
        </div>
      </PageContainer>
    </section>
  )
}
