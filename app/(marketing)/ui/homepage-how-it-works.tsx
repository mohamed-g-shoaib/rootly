"use client"

import * as React from "react"

import { motion } from "motion/react"

import { PageContainer } from "@/components/ui/page-container"
import { Separator } from "@/components/ui/separator"

const easeOut = [0.32, 0.72, 0, 1] as const

const STEPS = [
  {
    number: "01",
    title: "Add your courses",
    body: "Create a course for each video series, tutorial, or documentation set you are working through.",
  },
  {
    number: "02",
    title: "Capture as you learn",
    body: "Write Q&A notes for concepts you want to remember. Add code snippets directly in the note.",
  },
  {
    number: "03",
    title: "Review regularly",
    body: "Run a spaced repetition session on your notes. Rate each answer — Rootly adjusts your understanding level.",
  },
  {
    number: "04",
    title: "See your progress",
    body: "The overview shows your study time, mood trends, and understanding growth across all your courses.",
  },
] as const

export default function HomepageHowItWorks() {
  return (
    <section className="pt-14">
      <PageContainer>
        <div className="flex flex-col gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="text-2xl font-semibold"
          >
            How it works
          </motion.h2>

          <div className="flex flex-col">
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.number}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.35,
                    ease: easeOut,
                    delay: idx * 0.15,
                  }}
                  className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-[6rem_1fr]"
                >
                  <div className="font-mono text-lg text-muted-foreground">
                    {s.number}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground">{s.body}</div>
                  </div>
                </motion.div>

                {idx < STEPS.length - 1 ? <Separator /> : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
