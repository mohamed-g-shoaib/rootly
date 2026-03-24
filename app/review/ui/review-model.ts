export type ReviewNote = {
  id: string
  type: "qa"
  courseId: string | null
  courseTitle: string | null
  question: string
  answer: string
  understandingLevel: 1 | 2 | 3
  flag: boolean
}

export type ReviewSession = {
  id: string
  userId: string
  name: string
  date: string // YYYY-MM-DD
  questionCount: number
  shuffled: boolean
  flaggedOnly: boolean
  accuracy: number // 0-100
  timeSpentMinutes: number // total minutes
  notesLeveledUp: string[]
  notesLeveledDown: string[]
  weakestCourseId: string | null
  strongestCourseId: string | null
  createdAt: string
}

export type ReviewCourse = {
  id: string
  title: string
}

export type ReviewSessionConfig = {
  questionCountMode: "10" | "20" | "all" | "custom"
  customCount: number
  shuffled: boolean
  flaggedOnly: boolean
}
