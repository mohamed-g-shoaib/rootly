"use client"

import { Badge } from "@/components/ui/badge"
import { Reveal } from "./reveal"
import { HomepageHeroSurface } from "./homepage-hero-surface"
import { MarketingPrimaryCta } from "./marketing-primary-cta"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"

export default function HomepageHero() {
  return (
    <section className="pt-24 pb-14">
      <PageContainer>
        <div className="flex flex-col gap-10">
          <div className="flex max-w-3xl flex-col gap-6">
            <Reveal mode="mount">
              <Badge variant="outline" className="w-fit">
                Built for self-taught developers
              </Badge>
            </Reveal>

            <div className="flex flex-col gap-4">
              <Reveal
                as="h1"
                mode="mount"
                delay={0.05}
                className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                Your tutorial tabs are not a learning system.
              </Reveal>

              <Reveal
                as="p"
                mode="mount"
                delay={0.1}
                className="max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg"
              >
                Rootly turns scattered learning fragments into one deliberate
                place to think, remember, and continue with context.
              </Reveal>
            </div>

            <Reveal
              mode="mount"
              delay={0.15}
              className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
            >
              <MarketingPrimaryCta />

              <Button
                variant="outline"
                render={
                  <a href="#how-it-works" aria-label="See how Rootly works" />
                }
                className="w-full sm:w-auto"
              >
                See how it works
              </Button>
            </Reveal>
          </div>

          <Reveal mode="mount" delay={0.2}>
            <HomepageHeroSurface />
          </Reveal>
        </div>
      </PageContainer>
    </section>
  )
}
