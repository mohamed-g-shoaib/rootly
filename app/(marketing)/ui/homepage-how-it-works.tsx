"use client"

import * as React from "react"

import {
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

const HOW_IT_WORKS_CARD_CLASS =
  "w-[min(20rem,calc(100vw-2rem))] shrink-0 snap-start sm:w-96"
const HOW_IT_WORKS_VISUAL_CLASS = "h-60 p-4"

function SurfaceLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </div>
  )
}

function SurfaceFooter({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-12 shrink-0 flex-wrap items-start gap-2 border-t pt-3">
      {children}
    </div>
  )
}

function HowItWorksSurface({
  body,
  footer,
  label,
  meta,
}: {
  body: React.ReactNode
  footer: React.ReactNode
  label: string
  meta: React.ReactNode
}) {
  return (
    <Card className={HOW_IT_WORKS_VISUAL_CLASS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-3">
        <div className="flex items-start justify-between gap-3">
          <SurfaceLabel>{label}</SurfaceLabel>
          <div className="text-right text-sm text-muted-foreground">{meta}</div>
        </div>
        <div className="min-h-0 overflow-hidden">{body}</div>
        <SurfaceFooter>{footer}</SurfaceFooter>
      </div>
    </Card>
  )
}

function HowItWorksStep({
  visual,
  title,
  description,
}: {
  visual: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {visual}
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold text-balance">{title}</div>
        <div className="text-sm text-muted-foreground text-pretty">
          {description}
        </div>
      </div>
    </div>
  )
}

function CreateCourseVisual() {
  return (
    <HowItWorksSurface
      label="Organize"
      meta="3 resources"
      body={
        <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="font-medium leading-5">
              Machine Learning Fundamentals
            </div>
            <div className="text-sm text-muted-foreground">Andrew Ng</div>
          </div>
          <Progress value={42} className="mt-auto">
            <div className="flex items-center justify-between gap-2">
              <ProgressLabel>Progress</ProgressLabel>
              <ProgressValue />
            </div>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>
      }
      footer={
        <>
          <Badge variant="outline">Course</Badge>
          <Badge variant="secondary">42% complete</Badge>
        </>
      }
    />
  )
}

function SurfaceCaption({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="line-clamp-4 rounded-xl border bg-muted/35 px-3 py-2 text-sm text-muted-foreground text-pretty">
      {children}
    </div>
  )
}

function CaptureVisual() {
  return (
    <HowItWorksSurface
      label="Capture"
      meta="React"
      body={
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
          <div className="line-clamp-2 font-medium text-balance">
            When should you use <code>useMemo</code>?
          </div>
          <SurfaceCaption>
            Use it when expensive work or unstable references would otherwise
            make rerenders noisier than they need to be.
          </SurfaceCaption>
        </div>
      }
      footer={
        <>
          <Badge variant="secondary">Q&amp;A note</Badge>
          <Badge variant="info">Ready to review</Badge>
        </>
      }
    />
  )
}

function DailyLogVisual() {
  return (
    <HowItWorksSurface
      label="Reflect"
      meta={<span className="tabular-nums">2h 25m</span>}
      body={
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
          <div className="line-clamp-2 font-medium text-balance">
            Today I learned
          </div>
          <SurfaceCaption>
            I learned that <code>useMemo</code> is about expensive work and
            stable references, not premature optimization.
          </SurfaceCaption>
        </div>
      }
      footer={
        <>
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
        </>
      }
    />
  )
}

function ReviewVisual() {
  return (
    <HowItWorksSurface
      label="Review"
      meta="3 / 10 questions"
      body={
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
          <div className="line-clamp-2 font-medium text-balance">
            What problem does <code>useMemo</code> solve?
          </div>
          <SurfaceCaption>
            It memoizes expensive computations and helps keep references stable
            when that stability actually matters.
          </SurfaceCaption>
        </div>
      }
      footer={
        <>
          <Badge variant="info" className="justify-center gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} size={16} />
            Getting It
          </Badge>
          <Badge variant="outline" className="justify-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Clear
          </Badge>
        </>
      }
    />
  )
}

function TrackVisual() {
  return (
    <HowItWorksSurface
      label="Track"
      meta="avg. 2.4h / day"
      body={
        <div className="grid h-full min-h-0 gap-2 overflow-hidden">
          {TRACK_DATA.map((item) => (
            <div
              key={item.day}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3"
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
      }
      footer={
        <>
          <Badge variant="outline">5 day streak</Badge>
          <Badge variant="secondary">Study minutes</Badge>
        </>
      }
    />
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
                size="icon-lg"
                variant="outline"
                aria-label="Previous"
                disabled={!canScrollPrev}
                onClick={scrollPrev}
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
              </Button>
              <Button
                type="button"
                size="icon-lg"
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
            <Reveal amount={0.1} className={HOW_IT_WORKS_CARD_CLASS}>
              <HowItWorksStep
                visual={<CreateCourseVisual />}
                title="Create a course"
                description="Add what you&apos;re learning and keep resources in one place."
              />
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.05}
              className={HOW_IT_WORKS_CARD_CLASS}
            >
              <HowItWorksStep
                visual={<CaptureVisual />}
                title="Capture notes"
                description="Q&amp;A and freeform notes with code snippets and understanding levels."
              />
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.1}
              className={HOW_IT_WORKS_CARD_CLASS}
            >
              <HowItWorksStep
                visual={<DailyLogVisual />}
                title="Log daily progress"
                description="Track study time and mood to build consistency."
              />
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.15}
              className={HOW_IT_WORKS_CARD_CLASS}
            >
              <HowItWorksStep
                visual={<ReviewVisual />}
                title="Start a review session"
                description="Spaced repetition sessions built around your own notes."
              />
            </Reveal>

            <Reveal
              amount={0.1}
              delay={0.2}
              className={HOW_IT_WORKS_CARD_CLASS}
            >
              <HowItWorksStep
                visual={<TrackVisual />}
                title="Watch analytics"
                description="Watch your study time trend and keep improving."
              />
            </Reveal>
          </HowItWorksCarousel>
        </div>
      </PageContainer>
    </section>
  )
}
