"use client"

import * as React from "react"
import { Clock01Icon, Note05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardPanel } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

import { HomepageExtensionDialog } from "./homepage-extension-dialog"
import { Reveal } from "./reveal"

type TabId = "react" | "figma" | "duolingo"

const TAB_CONFIG = {
  react: {
    label: "React Docs",
    url: "react.dev/reference/react/useMemo",
  },
  figma: {
    label: "Figma Tutorial",
    url: "youtube.com/watch?v=... - Figma for Beginners",
  },
  duolingo: {
    label: "Spanish Lesson",
    url: "duolingo.com/lesson/spanish-basics",
  },
} as const

export function BrowserWindowMock() {
  const [activeTab, setActiveTab] = React.useState<TabId>("react")

  return (
    <Card className="overflow-hidden bg-muted/16">
      {/* Browser chrome bar */}
      <div className="border-b bg-muted/22 px-3 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2" aria-label="Window controls">
            <div className="size-2.5 rounded-full bg-destructive/50" />
            <div className="size-2.5 rounded-full bg-warning/50" />
            <div className="size-2.5 rounded-full bg-success/50" />
          </div>

          <div className="min-w-0 flex-1 truncate px-0.5 py-0.5 text-xs text-muted-foreground">
            {TAB_CONFIG[activeTab].url}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b bg-muted/16 px-3 pb-0">
        <div role="tablist" className="flex items-center gap-1">
          {(Object.keys(TAB_CONFIG) as TabId[]).map((tabId) => (
            <button
              key={tabId}
              role="tab"
              aria-selected={activeTab === tabId}
              aria-controls={`tabpanel-${tabId}`}
              onClick={() => setActiveTab(tabId)}
              className={`relative px-4 py-2 text-sm transition-colors ${
                activeTab === tabId
                  ? "font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {TAB_CONFIG[tabId].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <CardPanel className="p-2">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1.24fr)_minmax(17.5rem,0.76fr)]">
          {/* Main content - fixed height to prevent layout shift */}
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            className="h-[440px] min-w-0 rounded-[1.08rem] border bg-background/76 p-3 transition-opacity duration-200"
            style={{
              transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            {activeTab === "react" && <ReactContent />}
            {activeTab === "figma" && <FigmaContent />}
            {activeTab === "duolingo" && <DuolingoContent />}
          </div>

          {/* Side panel */}
          <aside
            className="flex min-w-0 flex-col rounded-[1.08rem] border bg-background/92 transition-opacity duration-200"
            style={{
              transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <div className="flex flex-col gap-2.5 p-2">
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

              {activeTab === "react" && <ReactSidePanel />}
              {activeTab === "figma" && <FigmaSidePanel />}
              {activeTab === "duolingo" && <DuolingoSidePanel />}

              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-[0.92rem] border bg-background/84 p-2.5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <HugeiconsIcon icon={Clock01Icon} size={16} />
                    Timer
                  </div>
                  <div className="pt-1.5 font-medium tabular-nums">
                    {activeTab === "react" && "00:42:18"}
                    {activeTab === "figma" && "01:15:32"}
                    {activeTab === "duolingo" && "00:28:45"}
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

// React Docs content
function ReactContent() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold">useMemo</div>
          <div className="pt-1 text-sm text-muted-foreground">
            Cache a calculation between renders.
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 text-sm text-muted-foreground">
        <p className="leading-6 text-pretty">
          <span className="rounded-md bg-warning/25 px-1 py-0.5 leading-7 text-foreground">
            Use memoization when recalculating a value is noticeably expensive
            or when keeping a stable reference prevents avoidable rerenders.
          </span>
        </p>
        <p className="leading-6 text-pretty">
          Memoization is most useful when the computation is slow or when the
          value is passed to a memoized child component.
        </p>
        <div className="rounded-xl border bg-background/84 p-3 font-mono text-[13px] leading-6 text-foreground">
          const visibleTodos = useMemo(() =&gt; filterTodos(todos, tab), [todos,
          tab])
        </div>
        <p className="leading-6 text-pretty">
          It does not make every component faster by default. The main goal is
          deliberate stability when that stability matters.
        </p>
      </div>
    </>
  )
}

function ReactSidePanel() {
  return (
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
        Use it for expensive work or when a stable reference helps memoized
        children avoid noisy rerenders.
      </div>
    </div>
  )
}

// Figma Tutorial content
function FigmaContent() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold">Figma for Beginners</div>
          <div className="pt-1 text-sm text-muted-foreground">
            Complete tutorial series
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 text-sm text-muted-foreground">
        <div className="flex aspect-video max-h-[180px] items-center justify-center rounded-xl border bg-muted/40">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">▶</div>
            <div className="pt-2 text-xs">Video: Layers and Components</div>
          </div>
        </div>
        <p className="leading-6 text-pretty">
          <span className="rounded-md bg-info/25 px-1 py-0.5 leading-7 text-foreground">
            Layers are the building blocks of your design. Components let you
            reuse elements across your project.
          </span>
        </p>
        <p className="leading-6 text-pretty">
          Understanding the layer hierarchy is essential for organizing complex
          designs. Use frames to group related elements together.
        </p>
      </div>
    </>
  )
}

function FigmaSidePanel() {
  return (
    <div className="rounded-[0.92rem] border bg-background/84 p-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">Q&amp;A note</div>
        <Badge variant="success">Clear</Badge>
      </div>
      <div className="pt-2.5 text-xs tracking-[0.12em] text-muted-foreground uppercase">
        Question
      </div>
      <div className="pt-1 text-sm text-pretty">
        What&apos;s the difference between frames and groups in Figma?
      </div>
      <div className="pt-2.5 text-xs tracking-[0.12em] text-muted-foreground uppercase">
        Answer
      </div>
      <div className="pt-1 text-sm text-pretty text-muted-foreground">
        Frames have their own properties like layout, constraints, and clipping.
        Groups are just containers without special properties.
      </div>
    </div>
  )
}

// Duolingo content
function DuolingoContent() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold">Spanish Basics</div>
          <div className="pt-1 text-sm text-muted-foreground">
            Lesson 3: Greetings and introductions
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 text-sm text-muted-foreground">
        <div className="rounded-xl border bg-success/10 p-4">
          <div className="text-base font-medium text-foreground">
            ¡Hola! ¿Cómo estás?
          </div>
          <div className="pt-2 text-sm">Hello! How are you?</div>
        </div>
        <p className="leading-6 text-pretty">
          <span className="rounded-md bg-success/25 px-1 py-0.5 leading-7 text-foreground">
            Common greetings are essential for starting conversations. Practice
            both formal and informal versions.
          </span>
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-background/84 p-2.5">
            <span className="text-foreground">Buenos días</span>
            <span className="text-xs">Good morning</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/84 p-2.5">
            <span className="text-foreground">Buenas tardes</span>
            <span className="text-xs">Good afternoon</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/84 p-2.5">
            <span className="text-foreground">Buenas noches</span>
            <span className="text-xs">Good evening</span>
          </div>
        </div>
      </div>
    </>
  )
}

function DuolingoSidePanel() {
  return (
    <div className="rounded-[0.92rem] border bg-background/84 p-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">Freeform note</div>
      </div>
      <div className="pt-2.5 text-xs tracking-[0.12em] text-muted-foreground uppercase">
        Vocabulary
      </div>
      <div className="space-y-1.5 pt-1 text-sm">
        <div className="text-pretty">
          <span className="font-medium text-foreground">Hola</span>
          <span className="text-muted-foreground"> - Hello (informal)</span>
        </div>
        <div className="text-pretty">
          <span className="font-medium text-foreground">¿Cómo estás?</span>
          <span className="text-muted-foreground"> - How are you?</span>
        </div>
        <div className="text-pretty">
          <span className="font-medium text-foreground">Muy bien</span>
          <span className="text-muted-foreground"> - Very well</span>
        </div>
        <div className="text-pretty">
          <span className="font-medium text-foreground">Gracias</span>
          <span className="text-muted-foreground"> - Thank you</span>
        </div>
      </div>
    </div>
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
