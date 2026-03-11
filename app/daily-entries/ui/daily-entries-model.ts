export type MoodValue = 1 | 2 | 3

export type MoodFilter = "all" | MoodValue

export type DailyEntry = {
  id: string
  date: string // YYYY-MM-DD
  studyTimeMinutes: number
  mood: MoodValue
  notes: string | null
  createdAt: string
  updatedAt: string
}

export function moodLabel(mood: MoodValue): "Burned Out" | "Neutral" | "Focused" {
  if (mood === 1) return "Burned Out"
  if (mood === 2) return "Neutral"
  return "Focused"
}

export function formatStudyTime(totalMinutes: number): string {
  const minutes = Math.max(0, Math.floor(totalMinutes))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  if (h <= 0) return `${m}m`
  if (m <= 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatEntryDate(date: string, now: Date): string {
  const d = new Date(`${date}T00:00:00`)
  const includeYear = d.getFullYear() !== now.getFullYear()
  const opts: Intl.DateTimeFormatOptions = includeYear
    ? { weekday: "long", month: "short", day: "numeric", year: "numeric" }
    : { weekday: "long", month: "short", day: "numeric" }

  return new Intl.DateTimeFormat("en-US", opts).format(d)
}

export function isSameDay(a: string, b: string): boolean {
  return a === b
}

export function toDateInputValue(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
