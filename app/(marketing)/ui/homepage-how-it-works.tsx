"use client"

import * as React from "react"

import {
  AlertCircleIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle01Icon,
  EyeIcon,
  InformationCircleIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import dynamic from "next/dynamic"

import { PageContainer } from "@/components/ui/page-container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider, SliderValue } from "@/components/ui/slider"
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card"
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover"

import {
  EmojioneV1GrinningFaceWithSmilingEyes,
  EmojioneV1SlightlySmilingFace,
  EmojioneV1WearyFace,
} from "@/app/daily-entries/ui/daily-entries-emojis"
import { Reveal } from "./reveal"

function useIsHoverDesktop() {
  const [value, setValue] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setValue(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])
  return value
}

const TRACK_DATA = [
  { day: "Mon", minutes: 42 },
  { day: "Tue", minutes: 28 },
  { day: "Wed", minutes: 55 },
  { day: "Thu", minutes: 20 },
  { day: "Fri", minutes: 48 },
] as const

function CreateCourseVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <div>Course</div>
          <div>3 links</div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="font-medium">Machine Learning Fundamentals</div>
          <div className="text-sm text-muted-foreground">Andrew Ng</div>
        </div>
        <Field>
          <Slider defaultValue={42}>
            <div className="mb-2 flex items-center justify-between gap-1">
              <FieldLabel className="text-sm font-medium">Progress</FieldLabel>
              <SliderValue />
            </div>
          </Slider>
        </Field>
      </div>
    </Card>
  )
}

function CaptureVisual() {
  const [showAnswer, setShowAnswer] = React.useState(false)
  const isHoverDesktop = useIsHoverDesktop()

  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">React</div>
          <Button
            type="button"
            size="icon"
            variant={showAnswer ? "secondary" : "outline"}
            aria-label={showAnswer ? "Hide answer" : "Show answer"}
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            <HugeiconsIcon
              icon={showAnswer ? ViewOffIcon : EyeIcon}
              size={18}
              color={showAnswer ? "var(--info)" : "currentColor"}
            />
          </Button>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="font-medium">When should you use useMemo?</div>
          {showAnswer ? (
            <div className="text-sm text-muted-foreground">
              When the computation is expensive and the reference needs to be
              stable across renders.
            </div>
          ) : isHoverDesktop ? (
            <PreviewCard>
              <PreviewCardTrigger render={<Button variant="ghost" size="sm" />}>
                Peek answer
              </PreviewCardTrigger>
              <PreviewCardPopup>
                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                  When the computation is expensive and the reference needs to
                  be stable across renders.
                </div>
              </PreviewCardPopup>
            </PreviewCard>
          ) : (
            <Popover>
              <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
                Peek answer
              </PopoverTrigger>
              <PopoverPopup align="start" className="w-64">
                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                  When the computation is expensive and the reference needs to
                  be stable across renders.
                </div>
              </PopoverPopup>
            </Popover>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">{"{ }"} JavaScript</Badge>
          <Badge variant="outline">Getting It</Badge>
        </div>
      </div>
    </Card>
  )
}

function DailyLogVisual() {
  const [mood, setMood] = React.useState<"burned" | "neutral" | "focused">(
    "focused"
  )

  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Today</div>
          <div className="tabular-nums">2h 25m</div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="text-center text-sm text-muted-foreground">
            Today I learned about useMemo and why I might not need useEffect.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={mood === "burned" ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setMood("burned")}
          >
            <EmojioneV1WearyFace className="size-4" aria-hidden="true" />
            Burned
          </Button>
          <Button
            type="button"
            variant={mood === "neutral" ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setMood("neutral")}
          >
            <EmojioneV1SlightlySmilingFace
              className="size-4"
              aria-hidden="true"
            />
            Neutral
          </Button>
          <Button
            type="button"
            variant={mood === "focused" ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setMood("focused")}
          >
            <EmojioneV1GrinningFaceWithSmilingEyes
              className="size-4"
              aria-hidden="true"
            />
            Focused
          </Button>
        </div>
      </div>
    </Card>
  )
}

function ReviewVisual() {
  const [understandingLevel, setUnderstandingLevel] = React.useState<1 | 2 | 3>(
    2
  )
  const isHoverDesktop = useIsHoverDesktop()

  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="text-sm text-muted-foreground">3 / 10 questions</div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="font-medium">What problem does useMemo solve?</div>
          {isHoverDesktop ? (
            <PreviewCard>
              <PreviewCardTrigger render={<Button variant="ghost" size="sm" />}>
                Peek answer
              </PreviewCardTrigger>
              <PreviewCardPopup>
                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                  It memoizes expensive computations to avoid re-running them
                  unnecessarily, and it can help keep references stable.
                </div>
              </PreviewCardPopup>
            </PreviewCard>
          ) : (
            <Popover>
              <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
                Peek answer
              </PopoverTrigger>
              <PopoverPopup align="start" className="w-64">
                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                  It memoizes expensive computations to avoid re-running them
                  unnecessarily, and it can help keep references stable.
                </div>
              </PopoverPopup>
            </Popover>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={understandingLevel === 1 ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setUnderstandingLevel(1)}
          >
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={18}
              color={
                understandingLevel === 1 ? "var(--warning)" : "currentColor"
              }
            />
            Confused
          </Button>
          <Button
            type="button"
            variant={understandingLevel === 2 ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setUnderstandingLevel(2)}
          >
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={18}
              color={understandingLevel === 2 ? "var(--info)" : "currentColor"}
            />
            Getting It
          </Button>
          <Button
            type="button"
            variant={understandingLevel === 3 ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setUnderstandingLevel(3)}
          >
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={18}
              color={
                understandingLevel === 3 ? "var(--success)" : "currentColor"
              }
            />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  )
}

const TrackVisualChart = dynamic(
  async () => {
    const { Bar, BarChart, ResponsiveContainer } = await import("recharts")
    return {
      default: ({
        data,
      }: {
        data: ReadonlyArray<{ readonly day: string; readonly minutes: number }>
      }) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Bar
              dataKey="minutes"
              fill="var(--color-chart-1)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ),
    }
  },
  { ssr: false }
)

function TrackVisual() {
  return (
    <Card className="h-48 p-4">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Study minutes</div>
          <div>avg. 2.4h / day</div>
        </div>
        <div className="w-full flex-1 overflow-hidden">
          <TrackVisualChart data={TRACK_DATA} />
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
              you learned, and watch your stats.
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
