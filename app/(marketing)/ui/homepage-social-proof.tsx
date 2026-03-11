"use client"

import * as React from "react"

import { motion } from "motion/react"

import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

const easeOut = [0.32, 0.72, 0, 1] as const

const QUOTES = [
  {
    quote: "[QUOTE PENDING]",
    name: "— [NAME PENDING]",
    role: "[ROLE PENDING]",
  },
  {
    quote: "[QUOTE PENDING]",
    name: "— [NAME PENDING]",
    role: "[ROLE PENDING]",
  },
  {
    quote: "[QUOTE PENDING]",
    name: "— [NAME PENDING]",
    role: "[ROLE PENDING]",
  },
] as const

export default function HomepageSocialProof() {
  return (
    <section className="pt-14">
      <PageContainer>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUOTES.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, ease: easeOut, delay: idx * 0.12 }}
            >
              <Card className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="text-sm italic">{q.quote}</div>
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">{q.name}</div>
                    <div>{q.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
