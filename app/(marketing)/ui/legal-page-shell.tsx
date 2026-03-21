import Link from "next/link"

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import RootlyLogo from "@/components/rootly-logo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

type LegalSection = {
  body: string[]
  title: string
}

export function LegalPageShell({
  backHref = "/",
  backLabel = "Back to homepage",
  description,
  sections,
  title,
}: {
  backHref?: string
  backLabel?: string
  description: string
  sections: LegalSection[]
  title: string
}) {
  return (
    <main className="min-h-svh bg-background py-8 sm:py-10">
      <PageContainer className="max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" render={<Link href={backHref} />}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              {backLabel}
            </Button>

            <Link href="/" aria-label="Rootly homepage" className="shrink-0">
              <div className="flex items-center gap-2 text-foreground">
                <RootlyLogo className="size-6" aria-hidden="true" />
                <span className="text-sm font-medium">Rootly</span>
              </div>
            </Link>
          </div>

          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-8">
              <header className="flex flex-col gap-3">
                <div className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {title}
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground text-pretty sm:text-base">
                  {description}
                </p>
              </header>

              <div className="flex flex-col gap-8">
                {sections.map((section) => (
                  <section key={section.title} className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground text-pretty sm:text-base">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </main>
  )
}
