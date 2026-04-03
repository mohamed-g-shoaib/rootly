"use client"

import {
  Clock01Icon,
  Note05Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardPanel,
} from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

import { HomepageExtensionDialog } from "./homepage-extension-dialog"
import { Reveal } from "./reveal"

export function BrowserWindowMock() {
  return (
    <Card className="overflow-hidden bg-muted/16">
      <div className="border-b bg-muted/22 px-3 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-destructive/60" />
            <div className="size-2.5 rounded-full bg-warning/60" />
            <div className="size-2.5 rounded-full bg-success/60" />
          </div>

          <div className="min-w-0 flex-1 px-0.5 py-0.5 text-xs text-muted-foreground">
            react.dev/reference/react/useMemo
          </div>
        </div>
      </div>

      <CardPanel className="p-2">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1.24fr)_minmax(17.5rem,0.76fr)]">
          <div className="min-w-0 rounded-[1.08rem] border bg-background/76 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold">useMemo</div>
                  <div className="pt-1 text-sm text-muted-foreground">
                    Cache a calculation between renders.
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 text-sm text-muted-foreground">
                <p className="text-pretty leading-6">
                  <span className="rounded-md bg-warning/25 px-1 py-0.5 leading-7 text-foreground">
                    Use memoization when recalculating a value is noticeably
                    expensive or when keeping a stable reference prevents
                    avoidable rerenders.
                  </span>
                </p>
                <p className="text-pretty leading-6">
                  Memoization is most useful when the computation is slow or
                  when the value is passed to a memoized child component.
                </p>
                <div className="rounded-xl border bg-background/84 p-3 font-mono text-[13px] leading-6 text-foreground">
                  const visibleTodos = useMemo(() =&gt; filterTodos(todos, tab),
                  [todos, tab])
                </div>
                <p className="text-pretty leading-6">
                  It does not make every component faster by default. The main
                  goal is deliberate stability when that stability matters.
                </p>
              </div>
          </div>

          <aside className="flex min-w-0 flex-col rounded-[1.08rem] border bg-background/92">
            <div className="flex flex-col gap-2.5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Rootly</div>
                  <div className="pt-0.5 text-xs text-muted-foreground">
                    Capture while you keep reading
                  </div>
                </div>
                <div className="pt-0.5 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  Side panel
                </div>
              </div>

              <div className="rounded-[0.92rem] border bg-background/84 p-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">Q&amp;A note</div>
                  <Badge variant="info">Getting It</Badge>
                </div>
                <div className="pt-2.5 text-xs tracking-[0.12em] text-muted-foreground uppercase">
                  Question
                </div>
                <div className="pt-1 text-sm text-pretty">
                  When should you use <code>useMemo</code>?
                </div>
                <div className="pt-2.5 text-xs tracking-[0.12em] text-muted-foreground uppercase">
                  Answer
                </div>
                <div className="pt-1 text-sm text-pretty text-muted-foreground">
                  Use it for expensive work or when a stable reference helps
                  memoized children avoid noisy rerenders.
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-[0.92rem] border bg-background/84 p-2.5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <HugeiconsIcon icon={Clock01Icon} size={16} />
                    Timer
                  </div>
                  <div className="pt-1.5 font-medium tabular-nums">
                    00:42:18
                  </div>
                  <div className="pt-1 text-sm text-muted-foreground">
                    Adds to today&apos;s study time.
                  </div>
                </div>
                <div className="rounded-[0.92rem] border bg-background/84 p-2.5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <HugeiconsIcon icon={Note05Icon} size={16} />
                    Today
                  </div>
                  <div className="pt-1.5 text-sm font-medium">Focused</div>
                  <div className="pt-1 text-sm text-muted-foreground">
                    2h 25m already tracked.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </CardPanel>
    </Card>
  )
}

export default function HomepageExtensionHighlight() {
  return (
    <section className="pt-20">
      <PageContainer>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Reveal as="h2" className="text-3xl font-semibold tracking-tight">
                Rootly can stay beside the page while you study.
              </Reveal>
              <Reveal
                as="p"
                delay={0.05}
                className="pt-2 text-base text-pretty text-muted-foreground sm:text-lg"
              >
                Read the source, mark the useful part, capture the note, keep
                the timer running, and continue without switching context.
              </Reveal>
            </div>

            <Reveal delay={0.1} className="shrink-0">
              <HomepageExtensionDialog buttonClassName="w-full sm:w-auto" />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <BrowserWindowMock />
          </Reveal>
        </div>
      </PageContainer>
    </section>
  )
}
