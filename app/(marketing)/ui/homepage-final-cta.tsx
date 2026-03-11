"use client"

import * as React from "react"
import Link from "next/link"

import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"

const easeOut = [0.32, 0.72, 0, 1] as const

export default function HomepageFinalCta() {
  return (
    <section className="pt-14">
      <div className="border-y bg-muted/40">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex flex-col items-center gap-4 py-14 text-center"
          >
            <div className="text-3xl font-semibold">
              Start learning with intention.
            </div>
            <div className="text-sm text-muted-foreground">
              Rootly is free to use. No credit card required.
            </div>
            <Button render={<Link href="/login" />}>
              Get started — it&apos;s free
            </Button>
          </motion.div>
        </PageContainer>
      </div>
    </section>
  )
}
