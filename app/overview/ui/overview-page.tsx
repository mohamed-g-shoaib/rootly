"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useMemo, useState } from "react"

import {
  AddCircleIcon,
  AiSearchIcon,
  Book01Icon,
  Calendar01Icon,
  Cancel01Icon,
  DatabaseLightningIcon,
  Home01Icon,
  NoteIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import RootlyLogo from "@/components/rootly-logo"
import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { FloatingDock } from "@/components/ui/floating-dock"
import { PageContainer } from "@/components/ui/page-container"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetPanel,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

type RangeKey = "7" | "30" | "90"

const DailyStudyTimeChart = dynamic(
  () => import("../ui/charts/daily-study-time-chart"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-56" /> }
)

const DailyMoodChart = dynamic(() => import("../ui/charts/daily-mood-chart"), {
  ssr: false,
  loading: () => <ChartSkeleton heightClassName="h-48" />,
})

const UnderstandingProgressChart = dynamic(
  () => import("../ui/charts/understanding-progress-chart"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-48" /> }
)

const CourseMasteryList = dynamic(
  () => import("../ui/charts/course-mastery-list"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-64" /> }
)

export default function OverviewPage() {
  const isMobile = useIsMobile()
  const [range, setRange] = useState<RangeKey>("7")
  const [commandOpen, setCommandOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)

  const mock = useMemo(() => buildMockOverview(range), [range])

  const shortcut = isMobile ? null : getDesktopShortcutLabel()

  const navigationItems = useMemo(
    () => [
      {
        label: "Overview",
        link: "/",
        icon: <HugeiconsIcon icon={Home01Icon} size={18} />,
      },
      {
        label: "Courses",
        link: "/courses",
        icon: <HugeiconsIcon icon={Book01Icon} size={18} />,
      },
      {
        label: "Notes",
        link: "/notes",
        icon: <HugeiconsIcon icon={NoteIcon} size={18} />,
      },
      {
        label: "Daily",
        link: "/daily-tracking",
        icon: <HugeiconsIcon icon={Calendar01Icon} size={18} />,
      },
      {
        label: "Review",
        link: "/review",
        icon: <HugeiconsIcon icon={DatabaseLightningIcon} size={18} />,
      },
    ],
    []
  )

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey && !e.metaKey) return
      if (e.key.toLowerCase() !== "k") return
      e.preventDefault()
      setCommandOpen(true)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="min-h-svh">
      <TopBar
        isMobile={isMobile}
        streakDays={mock.streakDays}
        shortcut={shortcut}
        onMobileSearch={() => setCommandOpen(true)}
        onMobileAvatar={() => setAvatarOpen(true)}
        onDesktopSearch={() => setCommandOpen(true)}
      />

      <main className={cn("min-h-svh", "pt-14", "pb-20")}>
        <PageContainer>
          {isMobile ? (
            <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pt-3 pb-3 lg:hidden">
              <RangeToggle range={range} onRangeChange={setRange} fullWidth />
            </div>
          ) : null}

          <section className="pt-4 lg:pt-6">
            <HeroBlock
              isMobile={isMobile}
              streakDays={mock.streakDays}
              todayLabel={mock.todayLabel}
              todayStudyMinutes={mock.todayStudyMinutes}
              totalCourses={mock.totalCourses}
              totalNotes={mock.totalNotes}
              avgUnderstanding={mock.avgUnderstanding}
            />
          </section>

          {!isMobile ? (
            <section className="pt-6">
              <RangeToggle range={range} onRangeChange={setRange} />
            </section>
          ) : null}

          <section className="pt-6">
            <ChartFrame title="Daily Study Time">
              <Suspense fallback={<ChartSkeleton heightClassName="h-56" />}>
                <DailyStudyTimeChart data={mock.dailyStudyTime} />
              </Suspense>
              {mock.emptyStates.studyTime ? (
                <div className="pt-3 text-sm text-muted-foreground">
                  No study sessions logged in this period.
                </div>
              ) : null}
            </ChartFrame>
          </section>

          <section className="pt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartFrame title="Daily Mood">
                <Suspense fallback={<ChartSkeleton heightClassName="h-48" />}>
                  <DailyMoodChart data={mock.dailyMood} />
                </Suspense>
                {mock.emptyStates.mood ? (
                  <div className="pt-3 text-sm text-muted-foreground">
                    No mood entries in this period.
                  </div>
                ) : null}
              </ChartFrame>

              <ChartFrame title="Understanding Progress">
                <Suspense fallback={<ChartSkeleton heightClassName="h-48" />}>
                  <UnderstandingProgressChart
                    data={mock.understandingProgress}
                  />
                </Suspense>
                {mock.emptyStates.understanding ? (
                  <div className="pt-3 text-sm text-muted-foreground">
                    No understanding data in this period.
                  </div>
                ) : null}
              </ChartFrame>
            </div>
          </section>

          <section className="pt-6 pb-6">
            <ChartFrame title="Course Mastery">
              <Suspense fallback={<ChartSkeleton heightClassName="h-64" />}>
                <CourseMasteryList
                  rows={mock.courseMastery}
                  emptyLabel="No course data for this period."
                />
              </Suspense>
            </ChartFrame>
          </section>
        </PageContainer>
      </main>

      <FloatingDock navigationItems={navigationItems} />

      {isMobile ? <MobileFab /> : null}

      <CommandPalette
        isMobile={isMobile}
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />

      <MobileAvatarSheet open={avatarOpen} onOpenChange={setAvatarOpen} />
    </div>
  )
}

function TopBar({
  isMobile,
  streakDays,
  shortcut,
  onMobileSearch,
  onMobileAvatar,
  onDesktopSearch,
}: {
  isMobile: boolean
  streakDays: number
  shortcut: "⌘K" | "Ctrl K" | null
  onMobileSearch: () => void
  onMobileAvatar: () => void
  onDesktopSearch: () => void
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <RootlyLogo className="size-6" aria-hidden="true" />
        </div>

        {!isMobile ? (
          <div className="text-sm text-muted-foreground">
            <span aria-hidden="true">🔥</span> {streakDays} day streak
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={onMobileSearch}
            >
              <HugeiconsIcon icon={AiSearchIcon} size={18} />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="min-w-72 justify-between"
              onClick={onDesktopSearch}
            >
              <span className="text-muted-foreground">
                Search or jump to...
              </span>
              {shortcut ? <Kbd>{shortcut}</Kbd> : null}
            </Button>
          )}

          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="User menu"
              onClick={onMobileAvatar}
            >
              <Avatar>
                <AvatarImage src="" alt="" />
                <AvatarFallback>RR</AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <UserAvatarPopover />
          )}
        </div>
      </div>
    </header>
  )
}

function UserAvatarPopover() {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" aria-label="User menu" />}
      >
        <Avatar>
          <AvatarImage src="" alt="" />
          <AvatarFallback>RR</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-72">
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-medium">Rami R</div>
            <div className="text-sm text-muted-foreground">
              rami@example.com
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">Theme</div>
            <Switch aria-label="Toggle theme" />
          </div>

          <Button variant="destructive-outline">Logout</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MobileAvatarSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        <SheetPanel>
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-medium">Rami R</div>
              <div className="text-sm text-muted-foreground">
                rami@example.com
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Theme</div>
              <Switch aria-label="Toggle theme" />
            </div>

            <Button variant="destructive-outline">Logout</Button>
          </div>
        </SheetPanel>
      </SheetContent>
    </Sheet>
  )
}

function HeroBlock({
  isMobile,
  streakDays,
  todayLabel,
  todayStudyMinutes,
  totalCourses,
  totalNotes,
  avgUnderstanding,
}: {
  isMobile: boolean
  streakDays: number
  todayLabel: string
  todayStudyMinutes: number
  totalCourses: number
  totalNotes: number
  avgUnderstanding: number
}) {
  return (
    <div className={cn("grid gap-6", !isMobile && "lg:grid-cols-3")}>
      <div className={cn("lg:col-span-2", "flex flex-col gap-2")}>
        {isMobile ? (
          <div className="text-sm text-muted-foreground">
            <span aria-hidden="true">🔥</span> {streakDays} day streak
          </div>
        ) : null}

        <div className="text-sm text-muted-foreground">
          Today&apos;s Study Time
        </div>
        <div className="text-4xl leading-none font-semibold">
          {todayStudyMinutes} min
        </div>
        <div className="text-sm text-muted-foreground">{todayLabel}</div>
      </div>

      <div className={cn("flex flex-col gap-3", isMobile && "lg:hidden")}>
        {isMobile ? (
          <div className="grid grid-cols-3 gap-3">
            <SummaryCell label="Total Courses" value={String(totalCourses)} />
            <SummaryCell label="Total Notes" value={String(totalNotes)} />
            <SummaryCell
              label="Avg. Understanding"
              value={`${avgUnderstanding.toFixed(1)} / 3`}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SummaryRow label="Total Courses" value={String(totalCourses)} />
            <SummaryRow label="Total Notes" value={String(totalNotes)} />
            <SummaryRow
              label="Avg. Understanding"
              value={`${avgUnderstanding.toFixed(1)} / 3`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}

function RangeToggle({
  range,
  onRangeChange,
  fullWidth = false,
}: {
  range: RangeKey
  onRangeChange: (value: RangeKey) => void
  fullWidth?: boolean
}) {
  return (
    <Tabs
      value={range}
      onValueChange={(v) => onRangeChange(v as RangeKey)}
      orientation="horizontal"
    >
      <TabsList className={cn(fullWidth && "w-full")}>
        <TabsTab value="7" className={cn(fullWidth && "flex-1")}>
          7 Days
        </TabsTab>
        <TabsTab value="30" className={cn(fullWidth && "flex-1")}>
          30 Days
        </TabsTab>
        <TabsTab value="90" className={cn(fullWidth && "flex-1")}>
          90 Days
        </TabsTab>
      </TabsList>
    </Tabs>
  )
}

function ChartFrame({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="font-medium">{title}</div>
      <div className="pt-3">{children}</div>
    </div>
  )
}

function ChartSkeleton({ heightClassName }: { heightClassName: string }) {
  return <Skeleton className={cn("w-full", heightClassName)} />
}

function MobileFab() {
  return (
    <Button
      size="icon-lg"
      className="fixed right-4 bottom-20 z-30 rounded-full"
      aria-label="Primary action"
    >
      <HugeiconsIcon icon={AddCircleIcon} size={20} />
    </Button>
  )
}

function CommandPalette({
  isMobile,
  open,
  onOpenChange,
}: {
  isMobile: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const content = (
    <CommandPanel>
      <Command>
        <CommandInput placeholder="Search notes, courses, or run a command..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            <CommandGroupLabel>Recent / Suggested</CommandGroupLabel>
            <CommandItem>Log today&apos;s entry</CommandItem>
            <CommandItem>Start review session</CommandItem>
            <CommandItem>Create new note</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup>
            <CommandGroupLabel>Notes</CommandGroupLabel>
            <CommandItem>
              React useEffect dependencies
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem>
              SQL partial indexes
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup>
            <CommandGroupLabel>Courses</CommandGroupLabel>
            <CommandItem>Advanced React Patterns</CommandItem>
            <CommandItem>Postgres Performance</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup>
            <CommandGroupLabel>Actions</CommandGroupLabel>
            <CommandItem>Go to Overview</CommandItem>
            <CommandItem>Go to Notes</CommandItem>
          </CommandGroup>
        </CommandList>

        <div className="flex items-center justify-between gap-2 border-t px-5 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="rounded-md border px-2 py-1">↑↓</div>
            <div>to navigate</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border px-2 py-1">Enter</div>
            <div>to select</div>
          </div>
        </div>
      </Command>
    </CommandPanel>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showCloseButton={false}>
          <div className="flex items-center justify-between p-4">
            <div className="font-medium">Search</div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </div>
          <div className="px-4 pb-4">{content}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandDialogPopup>{content}</CommandDialogPopup>
    </CommandDialog>
  )
}

function getDesktopShortcutLabel(): "⌘K" | "Ctrl K" {
  if (typeof navigator === "undefined") return "Ctrl K"
  const isMac = navigator.platform.toLowerCase().includes("mac")
  return isMac ? "⌘K" : "Ctrl K"
}

type MockPoint = {
  date: string
  label: string
}

type MockStudy = MockPoint & { minutes: number }

type MockMood = MockPoint & { mood: 1 | 2 | 3 | null }

type MockUnderstanding = MockPoint & { avg: number | null }

type MockCourseMasteryRow = {
  title: string
  avg: number
}

function buildMockOverview(range: RangeKey) {
  const now = new Date("2026-03-10T12:00:00Z")

  const days = range === "7" ? 7 : range === "30" ? 30 : 90

  const series = buildDaySeries(now, days)

  const dailyStudyTime: MockStudy[] = series.map((d, idx) => {
    const minutes = idx % 6 === 0 ? 0 : 35 + (idx % 5) * 18
    return { ...d, minutes }
  })

  const dailyMood: MockMood[] = series.map((d, idx) => {
    const hasEntry = idx % 8 !== 0
    if (!hasEntry) return { ...d, mood: null }
    const mood: 1 | 2 | 3 = ((idx % 3) + 1) as 1 | 2 | 3
    return { ...d, mood }
  })

  const understandingProgress: MockUnderstanding[] = series.map((d, idx) => {
    const hasData = idx % 7 !== 0
    if (!hasData) return { ...d, avg: null }
    const avg = Math.min(3, 1.4 + idx * 0.03)
    return { ...d, avg: Number(avg.toFixed(2)) }
  })

  const courseMastery: MockCourseMasteryRow[] = [
    { title: "Advanced React Patterns", avg: 1.6 },
    { title: "Postgres Performance", avg: 1.9 },
    { title: "TypeScript Deep Dive", avg: 2.2 },
    { title: "Next.js App Router", avg: 2.5 },
  ]

  const emptyStates = {
    studyTime: dailyStudyTime.every((d) => d.minutes === 0),
    mood: dailyMood.every((d) => d.mood == null),
    understanding: understandingProgress.every((d) => d.avg == null),
  }

  return {
    streakDays: 12,
    todayLabel: formatLongDate(now),
    todayStudyMinutes: 0,
    totalCourses: 4,
    totalNotes: 86,
    avgUnderstanding: 2.1,
    dailyStudyTime,
    dailyMood,
    understandingProgress,
    courseMastery,
    emptyStates,
  }
}

function buildDaySeries(now: Date, days: number): MockPoint[] {
  const items: MockPoint[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    items.push({
      date: d.toISOString().slice(0, 10),
      label: formatShortDate(d),
    })
  }
  return items
}

function formatLongDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d)
}

function formatShortDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d)
}
