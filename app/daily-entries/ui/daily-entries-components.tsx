"use client"

import * as React from "react"

import {
  Calendar01Icon,
  Clock01Icon,
  Delete01Icon,
  Edit01Icon,
  FilterIcon,
  MoreVerticalIcon,
  Note01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormSection } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu"
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover"
import { Field } from "@/components/ui/field"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/ui/number-field"

import {
  EmojioneV1GrinningFaceWithSmilingEyes,
  EmojioneV1SlightlySmilingFace,
  EmojioneV1WearyFace,
} from "./daily-entries-emojis"

import {
  formatEntryDate,
  formatStudyTime,
  isSameDay,
  moodLabel,
  toDateInputValue,
  type DailyEntry,
  type MoodFilter,
  type MoodValue,
} from "./daily-entries-model"

export function EmptyState({
  hasAnyEntries,
  hasFilters,
  onLogToday,
  onClearFilters,
}: {
  hasAnyEntries: boolean
  hasFilters: boolean
  onLogToday: () => void
  onClearFilters: () => void
}) {
  if (!hasAnyEntries) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={Note01Icon}
            size={24}
            className="text-muted-foreground"
          />
        </div>
        <div className="text-lg font-medium">No entries yet</div>
        <div className="max-w-[280px] text-sm text-muted-foreground">
          Start logging your study sessions to track your mood and progress over
          time.
        </div>
        <Button onClick={onLogToday} type="button" className="mt-2">
          Log Today
        </Button>
      </div>
    )
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={FilterIcon}
            size={24}
            className="text-muted-foreground"
          />
        </div>
        <div className="text-lg font-medium">No entries match your filters</div>
        <div className="max-w-[280px] text-sm text-muted-foreground">
          Try adjusting the date range or mood filters to find what you're
          looking for.
        </div>
        <Button
          variant="ghost"
          type="button"
          onClick={onClearFilters}
          className="mt-2"
        >
          Clear filters
        </Button>
      </div>
    )
  }

  return null
}

export function DateRangeFilterSheet({
  open,
  onOpenChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
}) {
  const selected = React.useMemo<DateRange | undefined>(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : undefined
    const to = toDate ? new Date(`${toDate}T00:00:00`) : undefined
    if (!from && !to) return undefined
    return { from, to }
  }, [fromDate, toDate])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side="bottom" variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>Dates</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            <div className="flex flex-col gap-3">
              <div className="flex justify-center">
                <Calendar
                  defaultMonth={selected?.from}
                  mode="range"
                  onSelect={(range) => {
                    onFromDateChange(
                      range?.from ? toDateInputValue(range.from) : ""
                    )
                    onToDateChange(range?.to ? toDateInputValue(range.to) : "")
                  }}
                  selected={selected}
                />
              </div>
              <Button
                variant={
                  fromDate === "" && toDate === "" ? "secondary" : "ghost"
                }
                className="justify-start"
                onClick={() => {
                  onFromDateChange("")
                  onToDateChange("")
                  onOpenChange(false)
                }}
              >
                Any time
              </Button>
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}

export function EntryCard({
  entry,
  now,
  onEdit,
  onDelete,
}: {
  entry: DailyEntry
  now: Date
  onEdit: () => void
  onDelete: () => void
}) {
  const isToday = isSameDay(entry.date, toDateInputValue(now))
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  return (
    <>
      <div className="h-[160px]">
        {/* EntryCard is intentionally shorter — less content than other card types */}
        <Card className="h-full p-4">
          <div className="flex h-full flex-col gap-3">
            <div className="flex shrink-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-1.5">
                <div className="truncate font-medium">
                  {formatEntryDate(entry.date, now)}
                </div>
                {isToday ? (
                  <Badge variant="outline" className="shrink-0">
                    Today
                  </Badge>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={16} />
                <span className="tabular-nums">
                  {formatStudyTime(entry.studyTimeMinutes)}
                </span>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center overflow-hidden">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {entry.mood === 1 ? (
                  <EmojioneV1WearyFace className="size-5" aria-hidden="true" />
                ) : entry.mood === 2 ? (
                  <EmojioneV1SlightlySmilingFace
                    className="size-5"
                    aria-hidden="true"
                  />
                ) : (
                  <EmojioneV1GrinningFaceWithSmilingEyes
                    className="size-5"
                    aria-hidden="true"
                  />
                )}
                <span>{moodLabel(entry.mood)}</span>
              </div>
            </div>

            <div className="-mb-2 flex shrink-0 items-center justify-between gap-2">
              <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                {entry.notes ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {entry.notes}
                  </span>
                ) : null}
              </div>

              <div className="-mr-2 flex shrink-0 items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" aria-label="More" />
                    }
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <HugeiconsIcon icon={Edit01Icon} size={18} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      closeOnClick
                      onClick={() => setDeleteOpen(true)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={18} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={onDelete}
      />
    </>
  )
}

function DeleteDialog({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove your log for this day. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" type="button" />}>
            Cancel
          </AlertDialogClose>
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              onOpenChange(false)
              onDelete()
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function MobileFilterSheet({
  title,
  open,
  onOpenChange,
  value,
  options,
  onValueChange,
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  options: { label: string; value: string }[]
  onValueChange: (value: string) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side="bottom" variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            <div className="flex flex-col gap-2">
              {options.map((o) => (
                <Button
                  key={o.value}
                  variant={o.value === value ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    onValueChange(o.value)
                    onOpenChange(false)
                  }}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}

export function EntryEditorSheet({
  mode,
  entry,
  open,
  onOpenChange,
  isMobile,
  lockDate,
  lockedDateValue,
  onSave,
}: {
  mode: "create" | "edit"
  entry: DailyEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  lockDate: boolean
  lockedDateValue: string
  onSave: (entry: DailyEntry) => void
}) {
  const editorKey =
    mode === "edit"
      ? `edit-${entry?.id ?? "missing"}`
      : `create-${lockedDateValue}`

  return (
    <EntryEditorSheetBody
      key={`${editorKey}-${lockDate ? "locked" : "unlocked"}`}
      mode={mode}
      entry={entry}
      open={open}
      onOpenChange={onOpenChange}
      isMobile={isMobile}
      lockDate={lockDate}
      lockedDateValue={lockedDateValue}
      onSave={onSave}
    />
  )
}

type EntryEditorSheetBodyProps = {
  mode: "create" | "edit"
  entry: DailyEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  lockDate: boolean
  lockedDateValue: string
  onSave: (entry: DailyEntry) => void
}

function EntryEditorSheetBody({
  mode,
  entry,
  open,
  onOpenChange,
  isMobile,
  lockDate,
  lockedDateValue,
  onSave,
}: EntryEditorSheetBodyProps) {
  const [discardOpen, setDiscardOpen] = React.useState(false)
  const [datePopoverOpen, setDatePopoverOpen] = React.useState(false)

  const [date, setDate] = React.useState(entry?.date ?? lockedDateValue)
  const [studyHours, setStudyHours] = React.useState<number>(
    entry ? Math.floor(entry.studyTimeMinutes / 60) : 0
  )
  const [studyMinutes, setStudyMinutes] = React.useState<number>(
    entry ? entry.studyTimeMinutes % 60 : 0
  )
  const [mood, setMood] = React.useState<MoodValue | null>(entry?.mood ?? null)
  const [notes, setNotes] = React.useState(entry?.notes ?? "")

  React.useEffect(() => {
    if (!open) return

    setDiscardOpen(false)
    setDatePopoverOpen(false)
    setDate(entry?.date ?? lockedDateValue)
    setStudyHours(entry ? Math.floor(entry.studyTimeMinutes / 60) : 0)
    setStudyMinutes(entry ? entry.studyTimeMinutes % 60 : 0)
    setMood(entry?.mood ?? null)
    setNotes(entry?.notes ?? "")
  }, [open, entry, mode, lockedDateValue])

  const now = React.useMemo(() => new Date(), [])

  const totalStudyMinutes = React.useMemo(() => {
    const safeH = Number.isFinite(studyHours) ? studyHours : 0
    const safeM = Number.isFinite(studyMinutes) ? studyMinutes : 0
    return Math.max(0, safeH) * 60 + Math.max(0, safeM)
  }, [studyHours, studyMinutes])

  const hasValidStudyTime = totalStudyMinutes > 0

  const hasChanges = React.useMemo(() => {
    if (mode === "create") {
      return (
        date !== lockedDateValue ||
        totalStudyMinutes !== 0 ||
        mood != null ||
        notes.trim() !== ""
      )
    }

    if (!entry) return false

    return (
      date !== entry.date ||
      totalStudyMinutes !== entry.studyTimeMinutes ||
      mood !== entry.mood ||
      notes.trim() !== (entry.notes ?? "").trim()
    )
  }, [date, entry, lockedDateValue, mode, mood, notes, totalStudyMinutes])

  function requestClose(nextOpen: boolean) {
    if (nextOpen) {
      onOpenChange(true)
      return
    }

    if (hasChanges) {
      setDiscardOpen(true)
      return
    }

    onOpenChange(false)
  }

  function submit() {
    if (!hasValidStudyTime) return
    if (!mood) return

    const id = mode === "edit" && entry ? entry.id : crypto.randomUUID()
    const createdAt =
      mode === "edit" && entry ? entry.createdAt : now.toISOString()

    const next: DailyEntry = {
      id,
      date,
      studyTimeMinutes: totalStudyMinutes,
      mood,
      notes: notes.trim() ? notes.trim() : null,
      createdAt,
      updatedAt: now.toISOString(),
    }

    onSave(next)
  }

  const side = isMobile ? "bottom" : "right"

  return (
    <>
      <Sheet open={open} onOpenChange={requestClose}>
        <SheetPopup side={side} variant="inset">
          <Form className="h-full gap-0">
            <SheetHeader>
              <SheetTitle>
                {mode === "create"
                  ? "Log Today"
                  : `Edit Entry — ${formatEntryDate(entry?.date ?? date, now)}`}
              </SheetTitle>
            </SheetHeader>

            <SheetPanel className="px-4 pb-5">
              <div className="flex flex-col gap-5">
                <FormSection>
                  <Label>Date</Label>
                  <Popover
                    open={datePopoverOpen}
                    onOpenChange={(next) => {
                      if (mode === "edit" || lockDate) return
                      setDatePopoverOpen(next)
                    }}
                  >
                    <PopoverTrigger
                      render={
                        <Button
                          className="w-full justify-start text-left font-normal"
                          variant="outline"
                          disabled={mode === "edit" || lockDate}
                        />
                      }
                    >
                      <HugeiconsIcon icon={Calendar01Icon} size={18} />
                      {date ? <span>{date}</span> : <span>Pick a date</span>}
                    </PopoverTrigger>
                    <PopoverPopup align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          date ? new Date(`${date}T00:00:00`) : undefined
                        }
                        onSelect={(selectedDate) => {
                          setDate(
                            selectedDate ? toDateInputValue(selectedDate) : ""
                          )
                          setDatePopoverOpen(false)
                        }}
                      />
                    </PopoverPopup>
                  </Popover>
                </FormSection>

                <FormSection>
                  <Label>Study Time</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Field>
                      <NumberField
                        min={0}
                        max={23}
                        value={studyHours}
                        onValueChange={(value) => setStudyHours(value ?? 0)}
                      >
                        <NumberFieldScrubArea label="Hours" />
                        <NumberFieldGroup>
                          <NumberFieldDecrement />
                          <NumberFieldInput />
                          <NumberFieldIncrement />
                        </NumberFieldGroup>
                      </NumberField>
                    </Field>
                    <Field>
                      <NumberField
                        min={0}
                        max={59}
                        value={studyMinutes}
                        onValueChange={(value) => setStudyMinutes(value ?? 0)}
                      >
                        <NumberFieldScrubArea label="Minutes" />
                        <NumberFieldGroup>
                          <NumberFieldDecrement />
                          <NumberFieldInput />
                          <NumberFieldIncrement />
                        </NumberFieldGroup>
                      </NumberField>
                    </Field>
                  </div>
                  {!hasValidStudyTime ? (
                    <div className="text-sm text-muted-foreground">
                      Enter a study time greater than 0.
                    </div>
                  ) : null}
                </FormSection>

                <FormSection>
                  <Label>Mood</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={mood === 1 ? "secondary" : "outline"}
                      onClick={() => setMood(1)}
                      className="justify-center gap-2"
                    >
                      <EmojioneV1WearyFace
                        className="hidden size-5 sm:block"
                        aria-hidden="true"
                      />
                      <span className="sm:hidden">Burned</span>
                      <span className="hidden sm:inline">Burned Out</span>
                    </Button>
                    <Button
                      variant={mood === 2 ? "secondary" : "outline"}
                      onClick={() => setMood(2)}
                      className="justify-center gap-2"
                    >
                      <EmojioneV1SlightlySmilingFace
                        className="hidden size-5 sm:block"
                        aria-hidden="true"
                      />
                      Neutral
                    </Button>
                    <Button
                      variant={mood === 3 ? "secondary" : "outline"}
                      onClick={() => setMood(3)}
                      className="justify-center gap-2"
                    >
                      <EmojioneV1GrinningFaceWithSmilingEyes
                        className="hidden size-5 sm:block"
                        aria-hidden="true"
                      />
                      Focused
                    </Button>
                  </div>
                </FormSection>

                <FormSection>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    placeholder="How did your study session go?"
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </FormSection>
              </div>
            </SheetPanel>

            <SheetFooter>
              <SheetClose render={<Button variant="ghost" type="button" />}>
                Cancel
              </SheetClose>
              <Button
                type="button"
                onClick={submit}
                disabled={
                  !hasValidStudyTime ||
                  mood == null ||
                  (mode === "edit" && !hasChanges)
                }
              >
                {mode === "create" ? "Save Entry" : "Save Changes"}
              </Button>
            </SheetFooter>
          </Form>
        </SheetPopup>
      </Sheet>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Your log will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" type="button" />}>
              Keep editing
            </AlertDialogClose>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                setDiscardOpen(false)
                onOpenChange(false)
              }}
            >
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function MoodFilterSheet({
  open,
  onOpenChange,
  value,
  onValueChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: MoodFilter
  onValueChange: (value: MoodFilter) => void
}) {
  const options = React.useMemo(
    () => [
      { value: "all", label: "All Moods" },
      { value: "3", label: "Focused" },
      { value: "2", label: "Neutral" },
      { value: "1", label: "Burned Out" },
    ],
    []
  )

  return (
    <MobileFilterSheet
      title="Mood"
      open={open}
      onOpenChange={onOpenChange}
      value={value === "all" ? "all" : String(value)}
      options={options}
      onValueChange={(v) => {
        if (v === "all") onValueChange("all")
        else onValueChange(Number(v) as MoodValue)
      }}
    />
  )
}
