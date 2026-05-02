"use client"

import * as React from "react"
import {
  PanelRightOpenIcon,
  Folder01Icon,
  Task01Icon,
  ChartAnalysisIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageContainer } from "@/components/ui/page-container"
import { Reveal } from "./reveal"
import {
  EmojioneV1GrinningFaceWithSmilingEyes,
  EmojioneV1SlightlySmilingFace,
  EmojioneV1WearyFace,
} from "@/app/daily-entries/ui/daily-entries-emojis"

function SidePanelVisual() {
  return (
    <div className="relative flex w-full max-w-[280px] overflow-hidden rounded-2xl border bg-background p-1.5 shadow-sm after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50">
      <div className="flex w-full gap-2 rounded-xl border border-border/50 bg-muted/20 p-2">
        {/* Fake Page Content */}
        <div className="flex flex-1 flex-col gap-2 p-1">
          <div className="h-2 w-1/2 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-full rounded-full bg-muted-foreground/10" />
          <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/10" />
          <div className="h-1.5 w-full rounded-full bg-muted-foreground/10" />
        </div>
        {/* Fake Side Panel */}
        <div className="flex w-2/5 flex-col gap-2 rounded-lg border bg-background p-2">
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-foreground" />
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="h-6 w-full rounded-md border border-border/50 bg-muted/20" />
          <div className="h-12 w-full rounded-md border border-border/50 bg-muted/20" />
        </div>
      </div>
    </div>
  )
}

function CourseVisual() {
  return (
    <div className="relative flex w-full max-w-[280px] flex-col gap-2 rounded-2xl border bg-background p-3 shadow-sm after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <HugeiconsIcon
          icon={Folder01Icon}
          size={14}
          className="text-muted-foreground"
        />
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Computer Science 101
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="rounded-lg border border-border/50 bg-muted/20 px-2 py-1.5">
          <div className="text-[10px] font-medium text-foreground">
            What is Big O notation?
          </div>
        </div>
        <div className="rounded-lg border border-border/50 bg-muted/20 px-2 py-1.5">
          <div className="text-[10px] font-medium text-foreground">
            Explain the OSI model.
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressVisual() {
  return (
    <div className="relative flex w-full max-w-[280px] flex-col gap-3 rounded-2xl border bg-background p-4 shadow-sm after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="text-[11px] font-medium text-muted-foreground">
          Today total
        </div>
        <div className="text-xs font-semibold text-foreground tabular-nums">
          1h 22m
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { Emoji: EmojioneV1WearyFace, label: "Burned", active: false },
          {
            Emoji: EmojioneV1SlightlySmilingFace,
            label: "Okay",
            active: false,
          },
          {
            Emoji: EmojioneV1GrinningFaceWithSmilingEyes,
            label: "Focused",
            active: true,
          },
        ].map(({ Emoji, label, active }) => (
          <div
            key={label}
            className={[
              "flex flex-col items-center justify-center rounded-xl py-2 transition-colors",
              active ? "bg-muted/80" : "bg-transparent",
            ].join(" ")}
          >
            <Emoji className="mb-1.5 size-5" />
            <div
              className={`text-[9px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsVisual() {
  return (
    <div className="relative flex w-full max-w-[280px] flex-col gap-3 rounded-2xl border bg-background p-4 shadow-sm after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-2xl)-2px)] after:border after:border-border/50">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="text-[11px] font-medium text-muted-foreground">
          Study Time
        </div>
        <div className="text-xs font-semibold text-foreground tabular-nums">
          +24%
        </div>
      </div>
      <div className="flex h-[72px] items-end gap-2 px-1">
        {[30, 50, 40, 85, 60, 45, 100].map((height, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end gap-1.5 h-full">
            <div 
              className={`w-full rounded-sm transition-colors ${i === 6 ? "bg-foreground" : "bg-muted-foreground/20"}`} 
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const FEATURES = [
  {
    title: "Contextual side panel",
    description:
      "Open Rootly right beside your study materials. Copy what you need and create notes without ever leaving your active tab.",
    icon: PanelRightOpenIcon,
    visual: <SidePanelVisual />,
  },
  {
    title: "Organized by course",
    description:
      "Keep your knowledge perfectly structured. Assign notes to specific courses to maintain clean, focused review sessions.",
    icon: Folder01Icon,
    visual: <CourseVisual />,
  },
  {
    title: "Track your habits",
    description:
      "Log your daily study time and focus level. Build consistent momentum and watch your learning streak grow over time.",
    icon: Task01Icon,
    visual: <ProgressVisual />,
  },
  {
    title: "Learning insights",
    description:
      "Visualize your progress with detailed charts. Identify weak spots and optimize your study schedule based on real data.",
    icon: ChartAnalysisIcon,
    visual: <StatsVisual />,
  },
]

export default function HomepageFeatures() {
  return (
    <section id="features" className="pt-24 pb-0 lg:pt-32">
      <PageContainer>
        <div className="flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex flex-col items-center gap-3 text-center lg:max-w-2xl">
            <Reveal
              as="h2"
              className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              The complete ecosystem for active learning.
            </Reveal>
            <Reveal
              as="p"
              delay={0.05}
              className="text-base text-pretty text-muted-foreground sm:text-lg"
            >
              Beyond just spaced repetition. Rootly is designed to keep your
              notes organized, your focus sharp, and your habits consistent.
            </Reveal>
          </div>

          <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-2">
            {FEATURES.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.1} className="h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card after:pointer-events-none after:absolute after:inset-[2px] after:rounded-[calc(var(--radius-3xl)-2px)] after:border after:border-border/50">
                  <div className="flex h-[200px] items-center justify-center bg-muted/30 p-6 sm:p-8">
                    {feat.visual}
                  </div>
                  <div className="flex flex-col gap-2 border-t p-6">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={feat.icon}
                        size={16}
                        className="text-foreground"
                      />
                      <h3 className="text-sm font-semibold text-foreground">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                      {feat.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
