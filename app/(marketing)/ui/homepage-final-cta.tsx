"use client"

import { Reveal } from "./reveal"
import { MarketingPrimaryCta } from "./marketing-primary-cta"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

export default function HomepageFinalCta() {
  return (
    <section className="pt-14">
      <PageContainer>
        <Reveal y={16}>
          <Card className="py-14">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="text-3xl font-semibold text-balance">
                Start learning with intention.
              </div>
              <div className="max-w-2xl text-sm text-pretty text-muted-foreground">
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
