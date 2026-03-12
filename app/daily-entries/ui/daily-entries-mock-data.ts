import type { DailyEntry, MoodValue } from "./daily-entries-model"

function makeEntry({
  id,
  date,
  studyTimeMinutes,
  mood,
  notes,
}: {
  id: string
  date: string
  studyTimeMinutes: number
  mood: MoodValue
  notes: string | null
}): DailyEntry {
  const createdAt = `${date}T08:00:00.000Z`
  const updatedAt = `${date}T08:00:00.000Z`

  return {
    id,
    date,
    studyTimeMinutes,
    mood,
    notes,
    createdAt,
    updatedAt,
  }
}

export const DAILY_ENTRIES_MOCK: DailyEntry[] = [
  makeEntry({
    id: "entry_12",
    date: "2026-03-10",
    studyTimeMinutes: 75,
    mood: 3,
    notes:
      "Finished the hooks section — felt smooth after refactoring the sheets.",
  }),
  makeEntry({
    id: "entry_11",
    date: "2026-03-09",
    studyTimeMinutes: 45,
    mood: 2,
    notes: "Light session. Reviewed notes and cleaned UI inconsistencies.",
  }),
  makeEntry({
    id: "entry_10",
    date: "2026-03-08",
    studyTimeMinutes: 120,
    mood: 3,
    notes: "Deep work on courses page and command palette footer.",
  }),
  makeEntry({
    id: "entry_09",
    date: "2026-03-07",
    studyTimeMinutes: 20,
    mood: 1,
    notes: "Burned out. Mostly just watched without taking notes.",
  }),
  makeEntry({
    id: "entry_08",
    date: "2026-03-06",
    studyTimeMinutes: 95,
    mood: 2,
    notes: "Implemented mobile filter sheets and export behavior.",
  }),
  makeEntry({
    id: "entry_07",
    date: "2026-03-05",
    studyTimeMinutes: 60,
    mood: 2,
    notes: null,
  }),
  makeEntry({
    id: "entry_06",
    date: "2026-03-04",
    studyTimeMinutes: 30,
    mood: 1,
    notes: "Hard day — struggled to focus.",
  }),
  makeEntry({
    id: "entry_05",
    date: "2026-03-03",
    studyTimeMinutes: 135,
    mood: 3,
    notes:
      "Review session: strongest course improved, weakest still needs work.",
  }),
  makeEntry({
    id: "entry_04",
    date: "2026-03-02",
    studyTimeMinutes: 55,
    mood: 2,
    notes: "Chipped away at daily tracking wireframe.",
  }),
  makeEntry({
    id: "entry_03",
    date: "2026-03-01",
    studyTimeMinutes: 15,
    mood: 1,
    notes: null,
  }),
  makeEntry({
    id: "entry_02",
    date: "2026-02-28",
    studyTimeMinutes: 80,
    mood: 3,
    notes: "Good momentum. Added course topics and links.",
  }),
  makeEntry({
    id: "entry_01",
    date: "2026-02-27",
    studyTimeMinutes: 40,
    mood: 2,
    notes: "Baseline day.",
  }),
]
