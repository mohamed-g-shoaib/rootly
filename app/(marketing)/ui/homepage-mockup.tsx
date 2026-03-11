"use client"

import * as React from "react"

import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"

import { NoteCard } from "@/app/notes/ui/notes-components"
import type { TypeFilter } from "@/app/notes/ui/notes-model"
import { useIsMobile } from "@/hooks/use-media-query"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"

import { HOMEPAGE_MOCK_NOTES } from "./homepage-mock-notes"

const easeOut = [0.32, 0.72, 0, 1] as const

export default function HomepageMockup() {
  const isMobile = useIsMobile()

  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")

  const [globalShowAnswers, setGlobalShowAnswers] = React.useState(false)
  const [answerOverrides, setAnswerOverrides] = React.useState<
    Record<string, boolean>
  >({})

  const [flagOverrides, setFlagOverrides] = React.useState<
    Record<string, boolean>
  >(() => Object.fromEntries(HOMEPAGE_MOCK_NOTES.map((n) => [n.id, n.flag])))

  const now = React.useMemo(() => new Date(), [])

  const typeItems = React.useMemo<{ value: TypeFilter; label: string }[]>(
    () => [
      { value: "all", label: "All Types" },
      { value: "qa", label: "Q&A" },
      { value: "freeform", label: "Freeform" },
    ],
    []
  )

  const selectedType = React.useMemo(
    () => typeItems.find((item) => item.value === typeFilter) ?? typeItems[0],
    [typeFilter, typeItems]
  )

  const visibleNotes = React.useMemo(() => {
    if (typeFilter === "all") return HOMEPAGE_MOCK_NOTES
    return HOMEPAGE_MOCK_NOTES.filter((n) => n.type === typeFilter)
  }, [typeFilter])

  const hasQa = React.useMemo(
    () => visibleNotes.some((n) => n.type === "qa"),
    [visibleNotes]
  )

  return (
    <section id="mockup" className="pt-14">
      <PageContainer>
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Try it — no account needed.
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="w-full"
          >
            <Card className="mx-auto w-full overflow-hidden sm:w-4/5">
              <div className="hidden items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2 sm:flex">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-destructive/70" />
                  <div className="size-2 rounded-full bg-warning/70" />
                  <div className="size-2 rounded-full bg-success/70" />
                </div>
                <div className="text-xs text-muted-foreground">
                  rootly.app/notes
                </div>
                <div className="w-12" />
              </div>

              <div className="border-b bg-background">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-40">
                      <Combobox
                        items={typeItems}
                        value={selectedType}
                        onValueChange={(value) =>
                          setTypeFilter((value?.value ?? "all") as TypeFilter)
                        }
                      >
                        <ComboboxInput
                          placeholder="All Types"
                          aria-label="Type"
                          showClear={typeFilter !== "all"}
                        />
                        <ComboboxPopup>
                          <ComboboxEmpty>No results found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                <span className="truncate">{item.label}</span>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxPopup>
                      </Combobox>
                    </div>

                    {hasQa ? (
                      <Button
                        variant={globalShowAnswers ? "secondary" : "outline"}
                        size="icon"
                        aria-label={
                          globalShowAnswers
                            ? "Hide all answers"
                            : "Show all answers"
                        }
                        onClick={() => setGlobalShowAnswers((v) => !v)}
                      >
                        <HugeiconsIcon
                          icon={globalShowAnswers ? ViewOffIcon : EyeIcon}
                          size={18}
                          color={
                            globalShowAnswers ? "var(--info)" : "currentColor"
                          }
                        />
                      </Button>
                    ) : null}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {visibleNotes.length} notes
                  </div>
                </div>
              </div>

              <ScrollArea className="max-h-svh" scrollbarGutter>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {visibleNotes.map((note, idx) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                          duration: 0.35,
                          ease: easeOut,
                          delay: 0.1 + idx * 0.1,
                        }}
                      >
                        <NoteCard
                          note={{
                            ...note,
                            flag: flagOverrides[note.id] ?? note.flag,
                          }}
                          now={now}
                          isMobile={isMobile}
                          globalShowAnswers={globalShowAnswers}
                          overrideShow={answerOverrides[note.id]}
                          onOverrideChange={(value) =>
                            setAnswerOverrides((prev) => ({
                              ...prev,
                              [note.id]: value,
                            }))
                          }
                          onToggleFlag={() =>
                            setFlagOverrides((prev) => ({
                              ...prev,
                              [note.id]: !(prev[note.id] ?? false),
                            }))
                          }
                          onEdit={() => void 0}
                          onViewFull={() => void 0}
                          onViewCode={() => void 0}
                          readOnly
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
