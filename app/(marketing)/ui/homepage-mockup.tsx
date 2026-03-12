"use client"

import * as React from "react"

import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

import { DemoStoreProvider } from "./mock-store"
import { MockNotesPage } from "./mock-notes-page"
import { MockSheetPortalProvider } from "./mock-sheet"

const easeOut = [0.32, 0.72, 0, 1] as const

function useBreakpoint(): "mobile" | "tablet" | "desktop" {
  const [breakpoint, setBreakpoint] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop")

  React.useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 639px)")
    const mqDesktop = window.matchMedia("(min-width: 1024px)")

    function compute() {
      if (mqMobile.matches) setBreakpoint("mobile")
      else if (mqDesktop.matches) setBreakpoint("desktop")
      else setBreakpoint("tablet")
    }

    compute()
    mqMobile.addEventListener("change", compute)
    mqDesktop.addEventListener("change", compute)
    return () => {
      mqMobile.removeEventListener("change", compute)
      mqDesktop.removeEventListener("change", compute)
    }
  }, [])

  return breakpoint
}

function toNoteCap(bp: "mobile" | "tablet" | "desktop") {
  if (bp === "mobile") return 3
  if (bp === "tablet") return 6
  return 9
}

export default function HomepageMockup() {
  const mockViewportRef = React.useRef<HTMLDivElement | null>(null)

  const breakpoint = useBreakpoint()
  const noteCap = React.useMemo(() => toNoteCap(breakpoint), [breakpoint])

  const [createOpen, setCreateOpen] = React.useState(false)
  const url = React.useMemo(() => `rootly.app/notes`, [])

  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="mockup" className="pt-14">
      <PageContainer>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="text-sm text-muted-foreground"
          >
            Try it — no account needed.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="w-full"
          >
            <Card className="w-full overflow-hidden">
              <div className="hidden items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2 sm:flex">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-destructive/70" />
                  <div className="size-2 rounded-full bg-warning/70" />
                  <div className="size-2 rounded-full bg-success/70" />
                </div>
                <div className="text-xs text-muted-foreground">{url}</div>
                <div className="w-12" />
              </div>

              <DemoStoreProvider noteCap={noteCap}>
                <div
                  ref={mockViewportRef}
                  className="relative overflow-hidden bg-background"
                >
                  <div className="sticky top-0 z-20 border-b bg-background">
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="text-sm font-medium text-foreground">
                        Notes
                      </div>

                      <Button
                        aria-label="New note"
                        className="shrink-0"
                        onClick={() => setCreateOpen(true)}
                      >
                        New Note
                      </Button>
                    </div>
                  </div>

                  <MockSheetPortalProvider container={mockViewportRef}>
                    <MockNotesPage
                      cardCap={noteCap}
                      breakpoint={breakpoint}
                      createOpen={createOpen}
                      onCreateOpenChange={setCreateOpen}
                    />
                  </MockSheetPortalProvider>
                </div>
              </DemoStoreProvider>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
