"use client"

import { Reveal } from "./reveal"
import { MarketingPrimaryCta } from "./marketing-primary-cta"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

export default function HomepageFinalCta() {
  return (
    <section className="py-24 lg:py-32">
      <PageContainer>
        <Reveal y={16}>
          <Card className="py-14 after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Start learning with intention.
              </div>
              <div className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
                Rootly gives your study sessions a place to build on each other
                instead of starting from scratch every time.
              </div>
              <MarketingPrimaryCta label="Start with Rootly" />
              <div className="text-sm text-muted-foreground">
                Rootly is free to use.
              </div>
            </div>
          </Card>
        </Reveal>
      </PageContainer>
    </section>
  )
}
