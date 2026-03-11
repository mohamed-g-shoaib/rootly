"use client"

import * as React from "react"
import Link from "next/link"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"

const easeOut = [0.32, 0.72, 0, 1] as const

export default function HomepageHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="pt-24">
      <PageContainer>
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 text-left sm:items-center sm:text-center">
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              The learning notebook built for developers.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOut, delay: 0.1 }}
              className="text-base text-muted-foreground sm:text-lg"
            >
              Capture notes, track progress, and review what you&apos;ve learned
              — all in one place.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut, delay: 0.2 }}
            className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
          >
            <Button
              render={<Link href="/login" />}
              className="w-full sm:w-auto"
            >
              Get started — it&apos;s free
            </Button>

            <Button
              variant="ghost"
              render={<a href="#mockup" aria-label="See how it works" />}
              className="w-full sm:w-auto"
            >
              See how it works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.6 }}
            className="pt-2"
          >
            <motion.div
              animate={
                reduceMotion ? { opacity: 1 } : { opacity: [1, 0.35, 1] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 1.6,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 0.6,
                      delay: 1,
                    }
              }
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
