"use client"

import { motion } from "motion/react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { PageContainer } from "@/components/ui/page-container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const easeOut = [0.32, 0.72, 0, 1] as const

const TRACK_DATA = [
  { day: "Mon", minutes: 42 },
  { day: "Tue", minutes: 28 },
  { day: "Wed", minutes: 55 },
  { day: "Thu", minutes: 20 },
  { day: "Fri", minutes: 48 },
] as const

function CaptureVisual() {
  return (
    <Card className="h-56 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="text-sm text-muted-foreground">React</div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="font-medium">When should you use useMemo?</div>
          <div className="text-sm text-muted-foreground">
            When the computation is expensive and the reference needs to be
            stable across renders.
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">{"{ }"} JavaScript</Badge>
          <Badge variant="outline">Getting It</Badge>
        </div>
      </div>
    </Card>
  )
}

function ReviewVisual() {
  return (
    <Card className="h-56 p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="text-sm text-muted-foreground">3 / 10 questions</div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="font-medium">What problem does useMemo solve?</div>
          <Button variant="outline" size="sm" className="w-fit">
            Reveal answer
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm">
            Confused
          </Button>
          <Button variant="secondary" size="sm">
            Getting It
          </Button>
          <Button variant="outline" size="sm">
            Clear
          </Button>
        </div>
      </div>
    </Card>
  )
}

function TrackVisual() {
  return (
    <Card className="h-56 p-4">
      <div className="flex h-full flex-col gap-4">
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...TRACK_DATA]}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <Bar
                dataKey="minutes"
                fill="var(--color-chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="text-center">🔥 12 day streak</div>
          <div className="text-center">avg. 2.4h / day</div>
        </div>
      </div>
    </Card>
  )
}

export default function HomepageFeatures() {
  return (
    <section className="pt-14">
      <PageContainer>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, ease: easeOut, delay: 0 }}
            className="flex flex-col gap-3"
          >
            <CaptureVisual />
            <div className="text-lg font-semibold">Capture</div>
            <div className="text-sm text-muted-foreground">
              Q&amp;A and freeform notes with code snippets, syntax
              highlighting, and understanding levels.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, ease: easeOut, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <ReviewVisual />
            <div className="text-lg font-semibold">Review</div>
            <div className="text-sm text-muted-foreground">
              Spaced repetition sessions built around your own notes — not a
              generic question bank.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, ease: easeOut, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <TrackVisual />
            <div className="text-lg font-semibold">Track</div>
            <div className="text-sm text-muted-foreground">
              Log daily study sessions and watch your understanding trend over
              time.
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
