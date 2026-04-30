"use client"

import * as React from "react"

import {
  BookOpen01Icon,
  Note05Icon,
  PlayIcon,
  PauseIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  animate,
} from "motion/react"

import { Card, CardPanel } from "@/components/ui/card"

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const PHASES = [
  {
    id: "problem",
    title: "Passive notes",
    caption: "Passive notes are easy to forget and hard to review.",
    duration: 5000,
  },
  {
    id: "solution",
    title: "Structured capture",
    caption: "Rootly captures knowledge as structured, reviewable cards.",
    duration: 5000,
  },
  {
    id: "value",
    title: "Active review",
    caption: "Spaced repetition ensures you remember what you learn.",
    duration: 5000,
  },
]

function PhaseProblem() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border bg-background after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50 sm:max-w-[320px]"
    >
      <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-2">
        <div className="size-2.5 rounded-full bg-border" />
        <div className="size-2.5 rounded-full bg-border" />
        <div className="size-2.5 rounded-full bg-border" />
      </div>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="text-sm font-semibold text-foreground/80">
          React Child Re-renders
        </div>
        <div className="text-xs leading-relaxed text-pretty text-muted-foreground/80">
          React components re-render when their state or props change. If a
          parent re-renders, all of its children will re-render by default.
        </div>
        <div className="relative text-xs leading-relaxed text-pretty text-muted-foreground/50">
          You can use React.memo to prevent unnecessary child re-renders. It's a
          higher order component...
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      </div>
    </motion.div>
  )
}

function PhaseSolution() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border bg-background after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50 sm:max-w-[320px]"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Note05Icon}
            size={14}
            className="text-foreground"
          />
          <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Rootly Q&A
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Question
          </div>
          <div className="text-sm font-medium text-balance text-foreground">
            When does a React child component re-render?
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-muted p-3">
          <div className="mb-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Answer
          </div>
          <div className="text-xs leading-relaxed text-pretty text-muted-foreground">
            Whenever its parent re-renders, or when its own state/props change.
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PhaseValue() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="relative flex w-full max-w-[280px] flex-col overflow-hidden rounded-3xl border bg-card after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-3xl)-2px)] after:border after:border-border/50 sm:max-w-[320px]"
    >
      <div className="flex min-h-[120px] flex-1 flex-col items-center justify-center p-4 sm:min-h-[140px] sm:p-5">
        <div className="mb-6 flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <HugeiconsIcon icon={BookOpen01Icon} size={12} />
            Daily Review
          </div>
          <div className="rounded-md border border-border/50 bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground tabular-nums">
            2 / 10
          </div>
        </div>

        <div className="mb-2 text-center text-sm font-medium text-balance text-foreground">
          When does a React child component re-render?
        </div>
      </div>

      <div className="flex gap-1.5 border-t bg-muted/40 p-2">
        <div className="flex-1 rounded-lg border bg-background py-2 text-center text-[11px] font-medium text-muted-foreground">
          Confused
        </div>
        <div className="flex-1 rounded-lg border bg-background py-2 text-center text-[11px] font-medium text-muted-foreground">
          Getting it
        </div>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 0.94, 1] }}
          transition={{ delay: 1.5, duration: 0.3, ease: EASE_OUT }}
          className="flex flex-1 items-center justify-center rounded-lg bg-foreground text-[11px] font-medium text-background"
        >
          Clear
        </motion.div>
      </div>
    </motion.div>
  )
}

function HeroStoryDemo({ isPlaying }: { isPlaying: boolean }) {
  const [phase, setPhase] = React.useState(0)
  const [phaseRunId, setPhaseRunId] = React.useState(0)
  const progress = useMotionValue(0)
  const progressControlsRef = React.useRef<ReturnType<typeof animate> | null>(
    null
  )

  React.useEffect(() => {
    if (!isPlaying) return

    progressControlsRef.current?.stop()
    progressControlsRef.current = null

    const currentProgress = progress.get()
    const remainingRatio = 1 - currentProgress
    const duration = (PHASES[phase].duration * remainingRatio) / 1000

    if (duration <= 0) return

    const controls = animate(progress, 1, {
      duration,
      ease: "linear",
      onComplete: () => {
        progress.set(0)
        setPhase((p) => (p + 1) % PHASES.length)
        setPhaseRunId((id) => id + 1)
      },
    })

    progressControlsRef.current = controls

    return () => controls.stop()
  }, [isPlaying, phase, phaseRunId, progress])

  const handlePhaseClick = (i: number) => {
    progressControlsRef.current?.stop()
    progress.set(0)
    setPhase(i)
    setPhaseRunId((id) => id + 1)
  }

  return (
    <div className="flex flex-col bg-background">
      {/* Progress Bars (Instagram style) */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-1.5">
          {PHASES.map((p, i) => {
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePhaseClick(i)}
                aria-label={`Go to phase ${i + 1}`}
                className="relative h-1.5 cursor-pointer overflow-hidden rounded-full bg-muted hover:bg-muted-foreground/20"
              >
                <motion.div
                  className="absolute inset-0 origin-left bg-foreground"
                  style={{
                    scaleX: i < phase ? 1 : i === phase ? progress : 0,
                  }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Split Stage */}
      <div className="flex h-[520px] flex-col sm:h-auto sm:min-h-[400px] sm:flex-row">
        {/* Left: Text */}
        <div className="flex h-[180px] flex-none flex-col justify-center px-6 sm:h-auto sm:flex-1 sm:px-10 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${phase}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="flex flex-col gap-2"
            >
              <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                {PHASES[phase].title}
              </div>
              <div className="text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl lg:text-3xl">
                {PHASES[phase].caption}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: UI Mock */}
        <div className="relative flex flex-1 items-center justify-center border-t bg-muted/20 p-4 sm:border-t-0 sm:border-l sm:p-6">
          <AnimatePresence mode="wait">
            {phase === 0 && <PhaseProblem key="problem" />}
            {phase === 1 && <PhaseSolution key="solution" />}
            {phase === 2 && <PhaseValue key="value" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function BrowserWindowMock() {
  const [isPlaying, setIsPlaying] = React.useState(true)

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full overflow-hidden rounded-[var(--radius-4xl)] bg-[url('/hero-bg.webp')] bg-cover bg-center p-4 sm:p-5 lg:p-6">
        <Card className="w-full overflow-hidden rounded-3xl border-border/80 bg-background after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-3xl)-2px)] after:border after:border-border/50">
          <div className="border-b bg-muted px-3 py-2 sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause demo" : "Play demo"}
                  className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={isPlaying ? PauseIcon : PlayIcon}
                    size={14}
                  />
                </button>
                <div className="h-3 w-px bg-border" />
                <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Rootly
                </div>
              </div>

              <div className="size-2.5 sm:w-12" />
            </div>
          </div>

          <CardPanel className="p-0 sm:p-0">
            <HeroStoryDemo isPlaying={isPlaying} />
          </CardPanel>
        </Card>
      </div>
    </MotionConfig>
  )
}
