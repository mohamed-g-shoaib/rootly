"use client"

import { AuthAwareCta } from "./auth-aware-cta"
import { Reveal } from "./reveal"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

export default function HomepageFinalCta() {
  return (
    <section className="pt-14">
      <PageContainer>
        <Reveal y={16}>
          <Card className="py-14">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="text-3xl font-semibold">
                Start learning with intention.
              </div>
              <div className="max-w-2xl text-sm text-muted-foreground italic">
                &quot;All disciplines repeated with consistency every day lead
                to great achievements gained slowly over time.&quot;, John C.
                Maxwell
              </div>
              <AuthAwareCta />
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
