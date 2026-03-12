"use client"

import * as React from "react"

import { motion, useReducedMotion } from "motion/react"

import { AuthAwareCta } from "./auth-aware-cta"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"

const easeOut = [0.32, 0.72, 0, 1] as const

export default function HomepageHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="pt-24">
      <PageContainer>
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 text-left sm:items-center sm:text-center">
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              The learning notebook built for developers.
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: easeOut, delay: 0.1 }}
              className="text-base text-muted-foreground sm:text-lg"
            >
              Capture notes, track progress, and review what you&apos;ve learned
              — all in one place.
            </motion.p>
          </div>

          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: easeOut, delay: 0.2 }}
            className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
          >
            <AuthAwareCta />

            <Button
              variant="outline"
              render={<a href="#mockup" aria-label="See how it works" />}
              className="w-full sm:w-auto"
            >
              See how it works
            </Button>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
