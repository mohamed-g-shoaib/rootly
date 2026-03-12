"use client"

import * as React from "react"
import Link from "next/link"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

const easeOut = [0.32, 0.72, 0, 1] as const

export default function HomepageFinalCta() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="pt-14">
      <PageContainer>
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <Card className="py-14">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="text-3xl font-semibold">
                Start learning with intention.
              </div>
              <div className="max-w-2xl text-sm text-muted-foreground italic">
                &quot;All disciplines repeated with consistency every day lead
                to great achievements gained slowly over time.&quot;, John C.
                Maxwell
              </div>
              <Button render={<Link href="/login" />} className="group">
                <span className="inline-flex items-center gap-2">
                  Get started
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Rootly is free to use.
              </div>
            </div>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}
