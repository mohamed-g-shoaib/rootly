"use client"

import * as React from "react"

import {
  AlertCircleIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageContainer } from "@/components/ui/page-container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"

import {
  EmojioneV1GrinningFaceWithSmilingEyes,
  EmojioneV1SlightlySmilingFace,
  EmojioneV1WearyFace,
} from "@/app/daily-entries/ui/daily-entries-emojis"
import { Reveal } from "./reveal"

const TRACK_DATA = [
  { day: "Mon", minutes: "42m", value: 74 },
  { day: "Tue", minutes: "28m", value: 48 },
  { day: "Wed", minutes: "55m", value: 100 },
  { day: "Thu", minutes: "20m", value: 36 },
  { day: "Fri", minutes: "48m", value: 86 },
] as const

function CreateCourseVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">Course</Badge>
          <div>3 resources</div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-medium text-balance">
            Machine Learning Fundamentals
          </div>
          <div className="text-sm text-muted-foreground">Andrew Ng</div>
          <div className="pt-2 text-sm text-muted-foreground text-pretty">
            Keep the course, docs, and reference links together so every study
            session starts with context.
          </div>
        </div>
        <Progress value={42}>
          <div className="flex items-center justify-between gap-2">
            <ProgressLabel>Progress</ProgressLabel>
            <ProgressValue />
          </div>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </div>
    </Card>
  )
}

function SurfaceCaption({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-muted/35 px-3 py-2 text-sm text-muted-foreground text-pretty">
      {children}
    </div>
  )
}

function CaptureVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">React</Badge>
          <Badge variant="info">Ready to review</Badge>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="font-medium text-balance">
            When should you use <code>useMemo</code>?
          </div>
          <SurfaceCaption>
            Use it when expensive work or unstable references would otherwise
            make rerenders noisier than they need to be.
          </SurfaceCaption>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Q&amp;A note</Badge>
          <Badge variant="outline">JavaScript</Badge>
          <Badge variant="outline">Getting It</Badge>
        </div>
      </div>
    </Card>
  )
}

function DailyLogVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Today</div>
          <div className="tabular-nums">2h 25m</div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <SurfaceCaption>
            Today I learned why <code>useMemo</code> is mostly about expensive
            work and stable references, not premature optimization.
          </SurfaceCaption>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Badge variant="outline" className="justify-center gap-2">
            <EmojioneV1WearyFace className="size-4" aria-hidden="true" />
            Burned
          </Badge>
          <Badge variant="outline" className="justify-center gap-2">
            <EmojioneV1SlightlySmilingFace
              className="size-4"
              aria-hidden="true"
            />
            Neutral
          </Badge>
          <Badge variant="success" className="justify-center gap-2">
            <EmojioneV1GrinningFaceWithSmilingEyes
              className="size-4"
              aria-hidden="true"
            />
            Focused
          </Badge>
        </div>
      </div>
    </Card>
  )
}

function ReviewVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <div>Review session</div>
          <div>3 / 10 questions</div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="font-medium text-balance">
            What problem does <code>useMemo</code> solve?
          </div>
          <SurfaceCaption>
            It memoizes expensive computations and helps keep references stable
            when that stability actually matters.
          </SurfaceCaption>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Badge variant="outline" className="justify-center gap-2">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} />
            Confused
          </Badge>
          <Badge variant="info" className="justify-center gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} size={16} />
            Getting It
          </Badge>
          <Badge variant="outline" className="justify-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Clear
          </Badge>
        </div>
      </div>
    </Card>
  )
}

function TrackVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Study minutes</div>
          <div>avg. 2.4h / day</div>
        </div>

        <div className="grid flex-1 gap-3">
          {TRACK_DATA.map((item) => (
            <div
              key={item.day}
              className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3"
            >
              <div className="text-sm text-muted-foreground">{item.day}</div>
              <Progress value={item.value} className="gap-0">
                <ProgressTrack className="h-2">
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
              <div className="text-sm tabular-nums text-muted-foreground">
                {item.minutes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function useCarouselControls() {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)

  const updateButtons = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanScrollPrev(el.scrollLeft > 0)
    setCanScrollNext(el.scrollLeft < max - 1)
  }, [])

  React.useEffect(() => {
    updateButtons()
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => updateButtons()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", updateButtons)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateButtons)
    }
  }, [updateButtons])

  const scrollByCard = React.useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.9))
    el.scrollBy({ left: direction * amount, behavior: "smooth" })
  }, [])

  return {
    scrollerRef,
    canScrollPrev,
    canScrollNext,
    scrollPrev: () => scrollByCard(-1),
    scrollNext: () => scrollByCard(1),
  }
}

function HowItWorksCarousel({
  scrollerRef,
  children,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  return (
    <div
      ref={scrollerRef}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto pe-16 pb-2 [scrollbar-width:none] sm:pe-24 [&::-webkit-scrollbar]:hidden"
      aria-label="How it works steps"
    >
      {children}
    </div>
  )
}

export default function HomepageHowItWorks() {
  const { scrollerRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarouselControls()

  return (
    <section id="how-it-works" className="pt-14">
      <PageContainer>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <Reveal as="h2" className="text-2xl font-semibold">
              How it works
            </Reveal>
            <Reveal
              as="p"
              delay={0.05}
              className="text-sm text-muted-foreground"
            >
              Set up a course, capture notes, log daily progress, review what
              you learned, and see the pattern in your effort.
            </Reveal>
            <Reveal
              delay={0.1}
              className="flex items-center gap-2 pt-2"
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="Previous"
                disabled={!canScrollPrev}
                onClick={scrollPrev}
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="Next"
                disabled={!canScrollNext}
                onClick={scrollNext}
              >
                <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
              </Button>
            </Reveal>
          </div>

          <HowItWorksCarousel scrollerRef={scrollerRef}>
            <Reveal amount={0.1} className="w-80 shrink-0 snap-start sm:w-96">
              <div className="flex flex-col gap-3">
                <CreateCourseVisual />
                <div className="text-lg font-semibold">Create a course</div>
                <div className="text-sm text-muted-foreground">
                  Add what you&apos;re learning and keep resources in one place.
                </div>
              </div>
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.05}
              className="w-80 shrink-0 snap-start sm:w-96"
            >
              <div className="flex flex-col gap-3">
                <CaptureVisual />
                <div className="text-lg font-semibold">Capture notes</div>
                <div className="text-sm text-muted-foreground">
                  Q&amp;A and freeform notes with code snippets and
                  understanding levels.
                </div>
              </div>
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.1}
              className="w-80 shrink-0 snap-start sm:w-96"
            >
              <div className="flex flex-col gap-3">
                <DailyLogVisual />
                <div className="text-lg font-semibold">Log daily progress</div>
                <div className="text-sm text-muted-foreground">
                  Track study time and mood to build consistency.
                </div>
              </div>
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.15}
              className="w-80 shrink-0 snap-start sm:w-96"
            >
              <div className="flex flex-col gap-3">
                <ReviewVisual />
                <div className="text-lg font-semibold">
                  Start a review session
                </div>
                <div className="text-sm text-muted-foreground">
                  Spaced repetition sessions built around your own notes.
                </div>
              </div>
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.2}
              className="w-80 shrink-0 snap-start sm:w-96"
            >
              <div className="flex flex-col gap-3">
                <TrackVisual />
                <div className="text-lg font-semibold">Watch analytics</div>
                <div className="text-sm text-muted-foreground">
                  Watch your study time trend and keep improving.
                </div>
              </div>
            </Reveal>
          </HowItWorksCarousel>
        </div>
      </PageContainer>
    </section>
  )
}
